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

class RequestSingleGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]
        self.user = await getUser(self.token)

        if not self.user:
            await self.close()
            return

        await self.accept()
        print("[RequestSingleGameConsumer]")
        sender_id = self.scope["user"].id
        group_name = self.get_group_name(sender_id, receiver_id)
        print("Group n°:", group_name, " created !")
        await self.channel_layer.group_add(group_name, self.channel_name)
        print("Channel name : ", self.channel_name)

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'invite':
            invite_to_player_id = data.get('invite_to')
            await self.send_invite(invite_to_player_id)

    async def send_invite(self, invite_to_player_id):
        # Logic to send an invitation to another player
        print(f"Sending game invite from {self.user.username} to player ID {invite_to_player_id}")
