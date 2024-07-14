from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from userman.utils import getLogging
from userman.models import Player
import jwt

logger = getLogging()


@sync_to_async
def get_user_by_id(user_id):
    try:
        obj =  Player.objects.get(id=user_id)
        return obj
    except Player.DoesNotExist:
        logger.error(f"Player does not exist with ID: {user_id}")
        return None

async def getUser(authorization_header):
    if not authorization_header:
        logger.error("Connection rejected: Authorization header not found.")
        return None

    token = authorization_header

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = await get_user_by_id(user_id)
        return user

    except IndexError:
        return None
    except jwt.ExpiredSignatureError:
        logger.error("Connection rejected: Token expired.")
        return None
    except jwt.InvalidTokenError:
        logger.error("Connection rejected: Invalid token.")
        return None
    except Player.DoesNotExist:
        logger.error(f"Player does not exist with ID: {user_id}")
        return None