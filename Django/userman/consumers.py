from asgiref.sync import sync_to_async
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import F
from userman.models import Player
from channels.db import database_sync_to_async


@database_sync_to_async
def get_user_by_id(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)

async def getUser(authorization_header):
    print(f"|{authorization_header}|")
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

class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("+++++++++++connect++++++++++++++++")
        print("+++++++++++-------++++++++++++++++")
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        if not authorization_header:
            await self.close()
            return

        user = await getUser(authorization_header=authorization_header)
        if user is None:
            print("user not found !!!!!")
            await self.close()
            return

        self.scope["user"] = user
        user.status = Player.STATUS_ONLINE
        await database_sync_to_async(user.save)()
        print(f"[{user.username}] Connected !!")
        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user:
            user.status = Player.STATUS_OFFLINE
            await database_sync_to_async(user.save)()
            print(f"[{user.username}] Disconnected !!")


    async def receive(self, text_data):
        pass