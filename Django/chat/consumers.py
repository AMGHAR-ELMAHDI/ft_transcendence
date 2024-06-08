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

    
@sync_to_async
def authenticate_user(authorization_header):
    
    if not authorization_header:
        return None, "Authorization header not found"
    
    try:
        token = authorization_header.decode('utf-8').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = get_object_or_404(get_user_model(), pk=user_id)
        return user, None
    except IndexError:
        return None, "Invalid token format"
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except (jwt.InvalidTokenError, KeyError):
        return None, "Invalid token"


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("-------------")
        print (self.scope['headers'])
        print("-------------")
        authorization_header = next((value for name, value in self.scope['headers'] if name == b'authorization'), None)
        
        if not authorization_header:
            print("---------> Connection rejected: Authorization header not found.")
            await self.close()
            return

        token = authorization_header.decode('utf-8')
        token_parts = token.split()
        if len(token_parts) != 2:
            print("---------> Connection rejected: Invalid token format.")
            await self.close()
            return

        token = token_parts[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            
            usr = await self.get_user_by_id( user_id)
            self.scope['user'] = usr
            print("---------> Connected to WebSocket")
            await self.accept()
            sender_id = self.scope['user'].id
            print("---------> User n°:", sender_id, " connected !")
            receiver_id = self.scope['url_route']['kwargs']['receiver_id']
            group_name = self.get_group_name(sender_id, receiver_id)
            print("---------> Group n°:", group_name, " created !")
            await self.channel_layer.group_add(group_name, self.channel_name)
            print("---------> Channel name : ", self.channel_name)
            
        except ...:
            print("---------> Connection rejected: Token expired.")
            await self.close()
        except jwt.ExpiredSignatureError:
            print("---------> Connection rejected: Token expired.")
            await self.close()
        except jwt.InvalidTokenError:
            print("---------> Connection rejected: Invalid token.")
            await self.close()
        except Player.DoesNotExist:
            print("--------------------------------------------")
            print(user_id)
            print("--------------------------------------------")
            print("Player does not exist with ID:", user_id)
            await self.close()



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