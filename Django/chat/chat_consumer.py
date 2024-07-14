from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from userman.models import Player
from .models import Message
import datetime
import json
from .utils import get_user_by_id, getUser
from userman.utils import getLogging

logger = getLogging()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        if not authorization_header:
            logger.warning("ChatConsumer: connect - Connection rejected: Authorization header not found.")
            await self.close()
            return

        user = await getUser(authorization_header=authorization_header)
        if user is None:
            logger.warning("ChatConsumer: connect - User not found.")
            await self.close()
            return
        self.scope["user"] = user

        logger.info(f"ChatConsumer: connect - {user.username} Connected successfully.")
        await self.accept()
        sender_id = self.scope["user"].id
        receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]
        group_name = self.get_group_name(sender_id, receiver_id)
        await self.channel_layer.group_add(group_name, self.channel_name)

    async def disconnect(self, close_code):
        logger.info("ChatConsumer: disconnect - Disconnected from WebSocket.")
        sender_id = self.scope['user'].id
        receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        group_name = self.get_group_name(sender_id, receiver_id)
        await self.channel_layer.group_discard(group_name, self.channel_name)

    async def receive(self, text_data):
        logger.info("ChatConsumer: receive - Received message from WebSocket: %s", text_data)
        try:
            message_data = json.loads(text_data)
            content = message_data.get('content')
            if content:
                logger.debug(f"ChatConsumer: receive - Message content: {content}")
                sender_id = self.scope['user'].id
                receiver_id = self.scope['url_route']['kwargs']['receiver_id']
                
                receiver = await get_user_by_id(receiver_id)
                sender = await get_user_by_id(sender_id)
                if sender is None or receiver is None:
                    logger.error("ChatConsumer: receive - Sender or receiver not found.")
                    return 
                group_name = self.get_group_name(sender_id, receiver_id)
                await self.save_message(sender, receiver, content)
                x = datetime.datetime.now()
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'chat_message',
                        'user': self.scope['user'].username,
                        'sender': self.scope['user'].id,
                        'timestamp': {
                            'year': x.year,
                            'month': x.month,
                            'day': x.day,
                            'hour': x.hour,
                            'minute': x.minute,
                        },
                        'content': content
                    }
                )
            else:
                logger.warning("ChatConsumer: receive - Received message is empty or does not contain content.")
        except json.JSONDecodeError:
            logger.error("ChatConsumer: receive - Failed to parse received message as JSON.")

    async def chat_message(self, event):
        content = event['content']
        sender = event['user']
        sender_id = event['sender']
        timestamp = event['timestamp']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'user': sender,
            'sender': sender_id,
            'timestamp': timestamp,
            'message': content
        }))

    def get_group_name(self, user_id1, user_id2):
        if user_id1 is not None and user_id2 is not None:
            return f"group_{min(user_id1, user_id2)}_{max(user_id1, user_id2)}"
        else:
            # Handle the case where one of the user IDs is None
            return None

    @sync_to_async
    def save_message(self, sender, receiver, content):
        logger.info("ChatConsumer: save_message - Saving new message.")
        user = settings.AUTH_USER_MODEL
        if sender and receiver:
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            message.save()