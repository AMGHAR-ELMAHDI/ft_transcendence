import json, requests
from django.http import JsonResponse
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from . import views
from userman import models
import asyncio, jwt

@database_sync_to_async
def get_invite(id):
    invite = models.Invites.objects.get(id=id)
    return invite

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
    except models.Player.DoesNotExist:
        print(f"Player does not exist with ID: {user_id}")
        return None

class GameConsumer_2(AsyncWebsocketConsumer):

    roomnb = 1
    rooms = {}
    task = ""
    date = ""
    end_date = ""

    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        self.invite = self.scope['url_route']['kwargs']['invite_id']
        self.InviteObj = await get_invite(self.invite)
        self.roomId = self.InviteObj.room_id
        user = await getUser(self.token)
        if user:
            self.username = user.username
            self.status = user.status
            user.status = 'I'
            await sync_to_async(user.save)(update_fields=['status'])
            print(user.status)
            await self.accept()
        else:
            return JsonResponse({'error': 'The user is not Authenticated or the room is already started'}, status=403)

        UserExist = False

        if GameConsumer_2.roomnb > 1:
            for skey, value in self.rooms.items():
                for key in value['players']:
                    if key == self.username and self.status == 'I':
                        UserExist = True
                        self.room_group_name = skey

        if not UserExist:
            self.room_group_name = f'{self.roomId}_{GameConsumer_2.roomnb}'

        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
            self.rooms[self.room_group_name] = {
                'players': {},
                'index': 0,
                'ball': views.Ball(67, 67, 7, 7, 10),
                'paddle2': views.Paddle(0, 20, 2, 2, 20, 160),
                'paddle1': views.Paddle(0, 50, 2, 2, 20, 160),
                'winner': None,
                'RunOnce': False,
                'id': 0,
            }

        ThisRoom = self.rooms[self.room_group_name]['players']
        Index = self.rooms[self.room_group_name]

        if self.username not in ThisRoom:
            Index['index'] += 1

        ThisRoom[self.username] = Index['index']

        if self.rooms[self.room_group_name]['players'][self.username] == 1:
            self.rooms[self.room_group_name]['paddle1'].name = self.username
        elif self.rooms[self.room_group_name]['players'][self.username] == 2:
            self.rooms[self.room_group_name]['paddle2'].name = self.username

        await self.send(text_data=json.dumps({
            "type": "identify",
            'roomId': self.room_group_name,
            "player": Index['index'],
            "name": self.username,
        }))

        print(self.rooms[self.room_group_name]['players'], '\noptions: ', self.rooms[self.room_group_name])

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        if Index['index'] + 1 >= 3:
            GameConsumer_2.roomnb += 1

        if Index['index'] == 2 and not Index['RunOnce']:
            Index['RunOnce'] = True
            self.InviteObj.status = 'S'
            await sync_to_async(self.InviteObj.save)(update_fields=['status'])
            self.task = asyncio.ensure_future(self.sendBallPos())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        infos = json.loads(text_data)
        message_type = infos.get("type")

        if message_type == "canvas":
            self.rooms[self.room_group_name]['ball'].BallX = infos["CanWidth"] / 2
            self.rooms[self.room_group_name]['ball'].BallY = infos["CanHeight"] / 2
            self.rooms[self.room_group_name]['ball'].canvasx = infos["CanWidth"]
            self.rooms[self.room_group_name]['ball'].canvash = infos["CanHeight"]
            self.rooms[self.room_group_name]['paddle2'].posX = infos["CanWidth"] - 20

        if message_type == "paddleUpdates":
            if infos["user"] == "1":
                await self.rooms[self.room_group_name]['paddle1'].update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": self.rooms[self.room_group_name]['paddle1'].posX,
                    "posY": self.rooms[self.room_group_name]['paddle1'].posY,
                }
            if infos["user"] == "2":
                await self.rooms[self.room_group_name]['paddle2'].update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": self.rooms[self.room_group_name]['paddle2'].posX,
                    "posY": self.rooms[self.room_group_name]['paddle2'].posY,
                }
            # await asyncio.sleep(0.002)
            await self.custom_Async(message, "paddleChan")

        if message_type == 'it_ends_now':
            roomName = infos['room']
            winner = self.rooms[roomName]['winner']

            if winner in self.rooms[roomName]['players']:
                index = self.rooms[roomName]['players'][winner]

            message = {
                'type': 'finals',
                'winner': winner,
                'index': index,
                'game': self.room_group_name,
            }

            await self.custom_Async(message, 'winner')

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )
    
    async def finals(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "finals", "message": message})
        )

    async def paddleChan(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "paddleChan", "message": message})
        )

    async def winner(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "winner", "message": message})
        )

    async def scored(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "scored", "message": message}))

    async def ballPos(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "ballPos", "message": message}))

    async def GetOpp(self):
        for key, value in self.rooms[self.room_group_name]['players'].items():
            if key != self.username:
                return key

    async def createGameObject(self, winner):
        try:
            self.end_date = timezone.now()
            room = self.rooms[self.room_group_name]['players']

            opp_name = await self.GetOpp()

            user = await sync_to_async(get_object_or_404)(models.Player, username=self.username)
            opp = await sync_to_async(get_object_or_404)(models.Player,username=opp_name)

            player_index = room[self.username]
            if player_index == 1:
                score = self.rooms[self.room_group_name]['paddle1'].score
            if player_index == 2:
                score = self.rooms[self.room_group_name]['paddle2'].score

            opp_index = room[opp_name]
            if opp_index == 1:
                opp_score = self.rooms[self.room_group_name]['paddle1'].score
            if opp_index == 2:
                opp_score = self.rooms[self.room_group_name]['paddle2'].score

            duration = self.end_date - self.date

            winner = await sync_to_async(get_object_or_404)(models.Player,username=winner)

            game = models.GameHistory(
                date=self.date,
                player=user,
                opponent=opp,
                winner=winner,
                player_score=score,
                opponent_score=opp_score,
                game_mode='O',
                game_duration_minutes=duration.total_seconds()
            )

            self.rooms[self.room_group_name]['id'] = game.id

            winner.points += winner.level * 30

            if winner.points >= winner.level * 1000:
                winner.level += 1
                winner.points = 0
                await sync_to_async(winner.save)(update_fields=['level'])
            await sync_to_async(winner.save)(update_fields=['points'])

            self.InviteObj.status = 'E'
            await sync_to_async(self.InviteObj.save)(update_fields=['status'])


            user.status = 'O'
            opp.status = 'O'
            await sync_to_async(user.save)(update_fields=['status'])
            await sync_to_async(opp.save)(update_fields=['status'])

            await sync_to_async(game.save)()
        except Exception as e:
            print(f"Error in createGameObject: {e}")

    async def sendBallPos(self):
        self.date = timezone.now()
        while True:
            message = {
                "type": "ballPos",
                "BallX": self.rooms[self.room_group_name]['ball'].BallX,
                "BallY": self.rooms[self.room_group_name]['ball'].BallY,
            }
            await self.custom_Async(message, "ballPos")
            await self.rooms[self.room_group_name]['ball'].update()
            await self.rooms[self.room_group_name]['ball'].Ballinter()
            res = await self.rooms[self.room_group_name]['ball'].BallScored(self.rooms[self.room_group_name]['paddle1'], self.rooms[self.room_group_name]['paddle2'])
            if res:
                message = {
                    "type": "scored",
                    "scorePlayer1": self.rooms[self.room_group_name]['paddle1'].score,
                    "scorePlayer2": self.rooms[self.room_group_name]['paddle2'].score,
                }
                await self.custom_Async(message, "scored")
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle1'])
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle2'])
            await self.rooms[self.room_group_name]['ball'].update()
            await self.rooms[self.room_group_name]['ball'].Ballinter()
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle1'])
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle2'])
            if self.rooms[self.room_group_name]['paddle1'].score == 7:
                self.rooms[self.room_group_name]['winner'] = self.rooms[self.room_group_name]['paddle1'].name
                await self.createGameObject(self.rooms[self.room_group_name]['winner'])
                await self.stop_task()
            if self.rooms[self.room_group_name]['paddle2'].score == 7:
                self.rooms[self.room_group_name]['winner'] = self.rooms[self.room_group_name]['paddle2'].name
                await self.createGameObject(self.rooms[self.room_group_name]['winner'])
                await self.stop_task()
            await asyncio.sleep(1 / 70)

    async def stop_task(self):
        if self.task and not self.task.done():
            await self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass