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
from userman.models import FriendshipRequest, Friendship

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
        if not self.user:
            await self.close()
            return
        self.user = user
        await self.accept()
        print(F"[RequestSingleGameConsumer] {self.user.usernam} connected !")

    async def disconnect(self, close_code):
        pass
    
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

    async def create(self, data):
        friend_id = data.get('friend')
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return
        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return
        if friend == self.user:
            await self.send(text_data=json.dumps({'error': 'You cannot send an invitation to yourself'}))
            return
        new_friendshipRequest = FriendshipRequest(from_user=friend, to_user=self.user)
        await sync_to_async(new_friendshipRequest.save)()

    async def acceptReq(self, data):
        friend_id = data.get('friend')
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return
        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return
        update_FriendshipRequest_relation = update_friendship(from_user=friend, to_user=self.user, status="A")

    async def denyReq(self, data):
        friend_id = data.get('friend')
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user ID is required'}))
            return
        friend = await get_user_by_id(friend_id)
        if not friend:
            await self.send(text_data=json.dumps({'error': 'user does not exist'}))
            return
        update_FriendshipRequest_relation = update_friendship(from_user=friend, to_user=self.user, status="R")

@database_sync_to_async
def update_friendship(from_user, to_user, status):
    try:
            friendship_request = FriendshipRequest.objects.get(from_user__id=from_user, to_user=to_user)
    except FriendshipRequest.DoesNotExist:
        return {'message': 'Friendship request not found'}
    friendship_request.status = status
    friendship_request.save()
    