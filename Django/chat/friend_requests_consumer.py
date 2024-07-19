from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
import json
import jwt
from userman.models import FriendshipRequest, Player, Friendship


@database_sync_to_async
def is_invite_exists(from_user, to_user):
        test1 =  FriendshipRequest.objects.filter(from_user=from_user, to_user=to_user, status="P")
        test2 =  FriendshipRequest.objects.filter(from_user=to_user, to_user=from_user, status="P")
        if test1.exists() or test2.exists():    
            return True
        return False

@database_sync_to_async
def get_user_by_id(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)

async def getUser(authorization_header):
    if not authorization_header:
        print("[getUser] Connection rejected: Authorization header not found.")
        return None

    token = authorization_header
    print(f"token : |{token}|")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = await get_user_by_id(user_id)
        return user

    except jwt.ExpiredSignatureError:
        print("[getUser] Connection rejected: Token expired.")
        return None
    except jwt.InvalidTokenError:
        print("[getUser] Connection rejected: Invalid token.")
        return None
    except Player.DoesNotExist:
        print(f"Player does not exist with ID: {user_id}")
        return None

class FriendshipRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        self.user = await getUser(self.token)
        if not self.user:
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add("friendship", self.channel_name)
        print(f"[FriendshipRequestConsumer] {self.user.username} connected!")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("friendship", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print('---------')
        print(data)
        print('---------')
        action = data.get('action')
        
        if action == 'create':
            await self.createReq(data)
        elif action == 'accept':
            await self.acceptReq(data)
        elif action == 'deny':
            await self.denyReq(data)

    async def createReq(self, data):
        friend_id = data.get('friend')
        if not friend_id:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return

        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return

        if friend == self.user:
            await self.send(text_data=json.dumps({'error': 'You cannot send an invitation to yourself'}))
            return
        test = await is_invite_exists(self.user, friend)
        if test:
            print("[exists ++++++++++++++]")
            return
        else:
            print("[exists -------------------")
            new_friendship_request = FriendshipRequest(from_user=self.user, to_user=friend)
            await sync_to_async(new_friendship_request.save)()

            await self.channel_layer.group_send(
                "friendship",
                {
                    'type': 'friend_request_update',
                    'message': 'new_friend_request'
                }
            )

    async def acceptReq(self, data):
        friend_id = data.get('friend')
        if not friend_id:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return

        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return

        await update_friendship(from_user=friend, to_user=self.user, status="A")

        await self.channel_layer.group_send(
            "friendship",
            {
                'type': 'notif_message',
                'user': self.user.username,
                'content': 'friend_request_accepted'
            }
        )
        await self.channel_layer.group_send(
            "friendship",
            {
                'type': 'friend_request_update',
                'message': 'new_friend_request'
            }
        )

    async def denyReq(self, data):
        friend_id = data.get('friend')
        if not friend_id:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return

        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return

        await update_friendship(from_user=friend, to_user=self.user, status="R")

        await self.channel_layer.group_send(
            "friendship",
            {
                'type': 'notif_message',
                'user': self.user.username,
                'content': 'friend_request_denied'
            }
        )
        await self.channel_layer.group_send(
            "friendship",
            {
                'type': 'friend_request_update',
                'message': 'new_friend_request'
            }
        )

    async def friend_request_update(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': message,
        }))
        
    async def notif_message(self, event):
        type = event['type']
        user = event['user']
        content = event['content']
        await self.send(text_data=json.dumps({
            'type': type,
            'user': user,
            'content': content,
        }))

@database_sync_to_async
def update_friendship(from_user, to_user, status):
    print('[update_friendship]')
    try:
        friendship_request = FriendshipRequest.objects.get(from_user=from_user, to_user=to_user)
    except FriendshipRequest.DoesNotExist:
        return {'message': 'Friendship request not found'}
    friendship_request.status = status
    friendship_request.save()
    if status == 'A':
        print('[update_friendship] [A]')
        p1 = Player.objects.get(id=from_user.id)
        p2 = Player.objects.get(id=to_user.id)
        f = Friendship(player1=p1, player2=p2)
        f.save()
    if status == 'R':
        friendship_request.delete()
