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


@database_sync_to_async
def get_user_by_id(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)



async def getUser(authorization_header):
    if not authorization_header:
        print("---------> Connection rejected: Authorization header not found.")
        return None

    token = authorization_header

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = await get_user_by_id(user_id)
        return user

    except jwt.ExpiredSignatureError:
        print("---------> Connection rejected: Token expired.")
        return None
    except jwt.InvalidTokenError:
        print("---------> Connection rejected: Invalid token.")
        return None
    except Player.DoesNotExist:
        print(f"Player does not exist with ID: {user_id}")
        return None

class BlockUnblockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = None
        self.token = self.scope['url_route']['kwargs']['token']
        self.user = await getUser(self.token)
        if self.user is None:
            await self.close()
        else:
            await self.accept()
            print(f"[WebSocket] User {self.user.id} ({self.user.username}) connected.")

    async def disconnect(self, close_code):
        if self.user:
            print(f"[WebSocket] User {self.user.id} ({self.user.username}) disconnected.")

    async def receive(self, text_data):
        data = json.loads(text_data)
        print('---------')
        print(data)
        print('---------')
        action = data.get('action')
        
        if action == 'block':
            await self.block_user(data)
        elif action == 'unblock':
            await self.unblock_user(data)

    async def block_user(self, data):
        blocked_id = data.get('blocked')
        if not blocked_id:
            await self.send(text_data=json.dumps({'error': 'Blocked user ID is required'}))
            return
        
        blocked_user = await get_user_by_id(blocked_id)
        if not blocked_user:
            await self.send(text_data=json.dumps({'error': 'Blocked user does not exist'}))
            return
        
        if blocked_user == self.user:
            await self.send(text_data=json.dumps({'error': 'You cannot block yourself'}))
            return
        
        block_relationship = Block(blocker=self.user, blocked=blocked_user)
        await sync_to_async(block_relationship.save)()
        
        await self.send(text_data=json.dumps({'message': 'User blocked successfully!'}))


    @database_sync_to_async
    def block_user_by_id(self, user_id):
        return Block.objects.filter(blocker=self.user, blocked=user_id).exists()

    async def unblock_user(self, data):
        blocked_id = data.get('blocked')
        if not blocked_id:
            await self.send(text_data=json.dumps({'error': 'Blocked user ID is required'}))
            return
        
        blocked_user = await get_user_by_id(blocked_id)
        if not blocked_user:
            await self.send(text_data=json.dumps({'error': 'Blocked user does not exist'}))
            return
        
        block_relationship_exists = await self.block_user_by_id(blocked_user.id)
        
        if block_relationship_exists:
            await database_sync_to_async(
                Block.objects.filter(blocker=self.user, blocked=blocked_user).delete
            )()
            await self.send(text_data=json.dumps({'message': 'User unblocked successfully!'}))
        else:
            await self.send(text_data=json.dumps({'error': 'Block relationship does not exist'}))