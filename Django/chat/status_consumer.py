from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import F
from userman.models import Player
from channels.db import database_sync_to_async
import jwt, json
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .utils import get_user_by_id, getUser
from userman.utils import getLogging
logger = getLogging()

class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("StatusConsumer: connect - Attempting to connect...")
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        if not authorization_header:
            await self.close()
            return

        user = await getUser(authorization_header)
        if user is None:
            logger.warning("StatusConsumer: connect - Connection rejected: User not found.")
            await self.close()
            return

        self.scope["user"] = user
        ConnType = self.scope["url_route"]["kwargs"]["type"]
        status_message = ""
        
        if ConnType == 1:
            user.status = Player.STATUS_ONLINE
            status_message = "ONLINE"
        elif ConnType == 2:
            user.status = Player.STATUS_IN_GAME
            status_message = "IN_GAME"
        
        await sync_to_async(user.save)(update_fields=['status'])
        await self.accept()
        logger.info(f"StatusConsumer: connect - Player {user.id} ({user.username}) connected with status: {status_message}")

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user:
            user.status = Player.STATUS_OFFLINE
            await sync_to_async(user.save)(update_fields=['status'])
            logger.info(f"StatusConsumer: disconnect - Player {user.id} ({user.username}) disconnected.")

    async def receive(self, text_data):
        pass