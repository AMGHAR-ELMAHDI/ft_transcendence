from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import F
from django.shortcuts import get_object_or_404
from userman.models import Player
import json
import jwt
from userman.models import Invites

def get_group_name(self, user_id1, user_id2):
    if user_id1 is not None and user_id2 is not None:
        return f"group_{min(user_id1, user_id2)}_{max(user_id1, user_id2)}"
    else:
        # still to Handle the case where one of the user IDs is None
        return None

@database_sync_to_async
def get_user_by_id(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)

async def getUser(authorization_header):
    if not authorization_header:
        #print("---------> Connection rejected: Authorization header not found.")
        return None

    token = authorization_header

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = await get_user_by_id(user_id)
        return user

    except jwt.ExpiredSignatureError:
        #print("---------> Connection rejected: Token expired.")
        return None
    except jwt.InvalidTokenError:
        #print("---------> Connection rejected: Invalid token.")
        return None
    except Player.DoesNotExist:
        #print(f"Player does not exist with ID: {user_id}")
        return None

class StartGame_consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        self.room_id = self.scope['url_route']['kwargs']['room']
        self.user = await getUser(self.token)

        if not self.user:
            await self.close()
            return
        
        await self.accept()
        #print(f"[{self.user}] ----------------------------------------------------")
        await self.channel_layer.group_add(str(self.room_id), self.channel_name)
        #print("[StartSingleGameConsumer] connected successfully ")
        #print(f"[{self.user}] joined the room [{self.room_id}]")

    async def receive(self, text_data):
        pass

    async def disconnect(self, close_code):
                await self.channel_layer.group_discard(str(self.room_id), self.channel_name)
