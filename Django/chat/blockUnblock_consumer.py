from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import F
from userman.models import Player
from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
import json
from chat.models import Block
from .utils import get_user_by_id, getUser
from userman.utils import getLogging

logger = getLogging()

class BlockUnblockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = None
        self.token = self.scope['url_route']['kwargs']['token']
        self.user = await getUser(self.token)
        if self.user is None:
            logger.warning("BlockUnblockConsumer: connect - User not found, closing connection.")
            await self.close()
        else:
            await self.accept()
            logger.info(f"BlockUnblockConsumer: connect - User {self.user.id} ({self.user.username}) connected.")
            await self.channel_layer.group_add("block_update", self.channel_name)

    async def disconnect(self, close_code):
        logger.info("BlockUnblockConsumer: disconnect - Disconnected from WebSocket.")
        await self.channel_layer.group_discard("block_update", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info("BlockUnblockConsumer: receive - Received data: %s", data)
        action = data.get('action')

        if action == 'block':
            await self.block_user(data)
        elif action == 'unblock':
            await self.unblock_user(data)
        
        await self.channel_layer.group_send(
            "block_update",
            {
                'type': 'block_update',
                'action': 'game_update',
                'message': 'Block-Unblock update !!'
            }
        )

    async def block_user(self, data):
        blocked_id = data.get('blocked')
        if not blocked_id:
            logger.error("BlockUnblockConsumer: block_user - Blocked user ID is required.")
            await self.send(text_data=json.dumps({'error': 'Blocked user ID is required'}))
            return

        blocked_user = await get_user_by_id(blocked_id)
        if not blocked_user:
            logger.error("BlockUnblockConsumer: block_user - Blocked user does not exist.")
            await self.send(text_data=json.dumps({'error': 'Blocked user does not exist'}))
            return

        if blocked_user == self.user:
            logger.warning("BlockUnblockConsumer: block_user - User tried to block themselves.")
            await self.send(text_data=json.dumps({'error': 'You cannot block yourself'}))
            return

        block_relationship = Block(blocker=self.user, blocked=blocked_user)
        await sync_to_async(block_relationship.save)()
        
        logger.info(f"BlockUnblockConsumer: block_user - User {self.user.id} blocked User {blocked_user.id}.")
        await self.send(text_data=json.dumps({'message': 'User blocked successfully!'}))

    @database_sync_to_async
    def block_user_by_id(self, user_id):
        return Block.objects.filter(blocker=self.user, blocked=user_id).exists()

    async def unblock_user(self, data):
        blocked_id = data.get('blocked')
        if not blocked_id:
            logger.error("BlockUnblockConsumer: unblock_user - Blocked user ID is required.")
            await self.send(text_data=json.dumps({'error': 'Blocked user ID is required'}))
            return

        blocked_user = await get_user_by_id(blocked_id)
        if not blocked_user:
            logger.error("BlockUnblockConsumer: unblock_user - Blocked user does not exist.")
            await self.send(text_data=json.dumps({'error': 'Blocked user does not exist'}))
            return

        block_relationship_exists = await self.block_user_by_id(blocked_user.id)

        if block_relationship_exists:
            await database_sync_to_async(
                Block.objects.filter(blocker=self.user, blocked=blocked_user).delete
            )()
            logger.info(f"BlockUnblockConsumer: unblock_user - User {self.user.id} unblocked User {blocked_user.id}.")
            await self.send(text_data=json.dumps({'message': 'User unblocked successfully!'}))
        else:
            logger.error("BlockUnblockConsumer: unblock_user - Block relationship does not exist.")
            await self.send(text_data=json.dumps({'error': 'Block relationship does not exist'}))

    async def block_update(self, event):
        message = event['message']
        action = event['action']
        logger.info(f"BlockUnblockConsumer: block_update - Sending block update message: {message}, action: {action}.")
        await self.send(text_data=json.dumps({
            'type': 'block_update',
            'message': message,
            'action': action
        }))