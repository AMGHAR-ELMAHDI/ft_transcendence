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
        user = await getUser(self.token)

        if not user:
            await self.close()
            return
        self.user = user
        await self.accept()
        await self.channel_layer.group_add("gameInvites", self.channel_name)
        print("[RequestSingleGameConsumer] connected successfully ")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("gameInvites", self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'invite':
            invite_to_player_id = data.get('invite_to')
            await self.send_invite(invite_to_player_id)
        elif action == 'accept':
            print("[RequestSingleGameConsumer] accept scoop ")
            invite_id = data.get('id')
            if invite_id:
                invite = await self.get_invite_by_id(invite_id)
                if invite:
                    await self.change_invite_status(invite, 'A')
        elif action == 'deny':
            print("[RequestSingleGameConsumer] deny scoop ")
            invite_id = data.get('id')
            print(F"[RequestSingleGameConsumer] deny scoop invite_id : {invite_id} ")
            if invite_id:
                invite = await self.get_invite_by_id(invite_id)
                if invite:
                    await self.change_invite_status(invite, 'R')
        
        await self.channel_layer.group_send(
            "gameInvites",
            {
                'type': 'game_request_update',
                'message': 'game play update !!'
            }
        )
            


    async def send_invite(self, invite_to_player_id):
        if self.user.id == invite_to_player_id:
            print('You cannot invite yourself to play a game !!')
            return
        print(f"Sending game invite from player ID {self.user.id} to player ID {invite_to_player_id}")
        room_id = get_group_name(self, self.user.id, invite_to_player_id)
        await self.create_invite(self.user.id, invite_to_player_id, room_id)

    @database_sync_to_async
    def get_invite_by_id(self, invite_id):
        try:
            invite = get_object_or_404(Invites, pk=invite_id)
        except Invites.DoesNotExist:
            print(F"[RequestSingleGameConsumer] Invitations {invite_id} does not exist !!")
        return invite

    @database_sync_to_async
    def change_invite_status(self, invite, status):
        if status == 'A':
            invite.status = status
            invite.save()
            print(F"[RequestSingleGameConsumer] Invitation {invite.id} Accepted by {self.user.username} !!")
            return invite
        elif status == 'R':
            invite.delete()

    @database_sync_to_async
    def create_invite(self, sender_id, receiver_id, room_id):

        sender = get_object_or_404(Player, pk=sender_id)
        receiver = get_object_or_404(Player, pk=receiver_id)
        invite = Invites(sender=sender, receiver=receiver, room_id=room_id)
        invite.save()
        return invite

    async def game_invite(self, event):
        action = event['action']
        await self.send(text_data=json.dumps({
            'type': 'game_invite',
            'action': action,
        }))

    async def game_request_update(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'message': message,
        }))