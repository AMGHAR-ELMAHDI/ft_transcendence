from django.contrib.auth import get_user_model
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from userman.models import Player
from .models import Message
import datetime
import json
import jwt

    
@database_sync_to_async
def get_user_by_id(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)



async def getUser(authorization_header):
    print(f"|{authorization_header}|")
    if not authorization_header:
        print("---------> Connection rejected: Authorization header not found.")
        return

    token = authorization_header

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = await get_user_by_id(user_id)
        return user

    except IndexError:
        print("--------------------------------------------")
        print("Invalid token format")
        print("--------------------------------------------")
        return None
    except jwt.ExpiredSignatureError:
        print("--------------------------------------------")
        print("---------> Connection rejected: Token expired.")
        print("--------------------------------------------")
        return None
    except jwt.InvalidTokenError:
        print("--------------------------------------------")
        print("---------> Connection rejected: Invalid token.")
        print("--------------------------------------------")
        return None
    except Player.DoesNotExist:
        print("--------------------------------------------")
        print("Player does not exist with ID:", user_id)
        print("--------------------------------------------")
        return None


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        print("--------------")
        print(f"|{authorization_header}|")
        print("--------------")
        if not authorization_header:
            print("---------> Connection rejected: Authorization header not found.")
            await self.close()

        user = await getUser(authorization_header=authorization_header)
        if user is None:
            print("user not found !!!!!")
            await self.close
            return
        self.scope["user"] = user

        print("---------> Connected to WebSocket")
        await self.accept()
        sender_id = self.scope["user"].id
        print("---------> User n°:", sender_id, " connected !")
        receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]
        group_name = self.get_group_name(sender_id, receiver_id)
        print("---------> Group n°:", group_name, " created !")
        await self.channel_layer.group_add(group_name, self.channel_name)
        print("---------> Channel name : ", self.channel_name)



    async def disconnect(self, close_code):
        print("---------> Disconnected from WebSocket")
        sender_id = self.scope['user'].id
        receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        group_name = self.get_group_name(sender_id, receiver_id)
        await self.channel_layer.group_discard(group_name, self.channel_name)

    async def receive(self, text_data):
        print("---------> Received message from WebSocket:", text_data)
        try:
            message_data = json.loads(text_data)
            content = message_data.get('content')
            if content:
                print('p[', content, 'p]')
                sender_id = self.scope['user'].id
                receiver_id = self.scope['url_route']['kwargs']['receiver_id']
                
                receiver = await self.get_user_by_id( receiver_id)
                sender = await self.get_user_by_id( sender_id)
                print("-----------")
                print("sender id : ", sender_id)
                print("reciever id : ", receiver_id)
                print(type(sender))
                print("-----------")
                group_name = self.get_group_name(sender_id, receiver_id)
                await self.save_message(sender, receiver, content)
                # Broadcast the message to the group
                x = datetime.datetime.now()
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'chat_message',
                        'user' : self.scope['user'].username,
                        'timestamp' : {
                            'year' : x.year,
                            'month' : x.month,
                            'day' : x.day,
                            'hour' : x.hour,
                            'minute' : x.minute,
                        },
                        'content': content
                    }
                )
            else:
                print("Received message is empty or does not contain content.")
        except json.JSONDecodeError:
            print("Failed to parse received message as JSON.")

    async def chat_message(self, event):
        content = event['content']
        sender = event['user']
        timestamp = event['timestamp']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'user' : sender,
            'timestamp' : timestamp,
            'message': content
        }))

    def get_group_name(self, user_id1, user_id2):
        if user_id1 is not None and user_id2 is not None:
            return f"group_{min(user_id1, user_id2)}_{max(user_id1, user_id2)}"
        else:
            # still to Handle the case where one of the user IDs is None
            return None


    @sync_to_async
    def save_message(self, sender, receiver, content):
        user = settings.AUTH_USER_MODEL
        print(user)
        print("new message saved -------------------->")
        if sender and receiver:
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            message.save()
    
    @sync_to_async
    def get_user_by_id(self, user_id):
        try:
            obj =  Player.objects.get(id=user_id)
            print("--------------------------------------------")
            print("--------------get_user_by_id-----------------")
            
            print(type(obj))
            print("--------------------------------------------")
            return obj
        except Player.DoesNotExist:
            print("User does not exist with ID:", user_id)
            return None