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
                'ball': views.Ball(67, 67, 7, 8, 8),
                'paddle2': views.Paddle(0, 20, 1.5, 1.5, 20, 160),
                'paddle1': views.Paddle(0, 50, 1.5, 1.5, 20, 160),
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
            await self.custom_Async({'type': 'start'}, 'start')
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
                self.rooms[self.room_group_name]['paddle1'].speed = True
                self.rooms[self.room_group_name]['paddle1'].index = infos["user"]
                await self.rooms[self.room_group_name]['paddle1'].update(infos["key"])
            if infos["user"] == "2":
                self.rooms[self.room_group_name]['paddle2'].speed = True
                self.rooms[self.room_group_name]['paddle2'].index = infos["user"]
                await self.rooms[self.room_group_name]['paddle2'].update(infos["key"])

        if message_type == 'stopPaddle':
            if infos["user"] == "1":
                self.rooms[self.room_group_name]['paddle1'].speed = False
            if infos["user"] == "2":
                self.rooms[self.room_group_name]['paddle2'].speed = False

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
    
    async def start(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "start", "message": message})
        )

    async def finals(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "finals", "message": message})
        )

    async def earnedAch(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "earnedAch", "message": message})
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

    async def getLoser(self, winner, user, opp):
        if winner.username == user.username:
            return opp
        else:
            return user

    async def getAchievement(self, id):
        AchObj = await sync_to_async(get_object_or_404)(models.Achievement, id=id)
        return AchObj

    async def AchievementExists(self, id, user):
        Achievement = await self.getAchievement(id)
        try:
            await sync_to_async(models.AchievementPerUser.objects.get)(user=user, achievement=Achievement)
            return None
        except models.AchievementPerUser.DoesNotExist:
            return Achievement

    async def sendAchievement(self, achievement, user):
        message = {
            'type': 'earnedAch',
            'index': self.rooms[self.room_group_name]['players'][user.username],
            'title': achievement.title,
            'description': achievement.desc,
            'image': achievement.path
        }
        await self.custom_Async(message, 'earnedAch')

    async def CheckOppscore(self, loser, gameInfo):
        if loser.username == gameInfo.opponent.username and gameInfo.opponent_score == 0:
            return True
        if loser.username == gameInfo.player.username and gameInfo.player_score == 0:
            return True
        return False

    async def CollectAchievement(self, gameInfo):
        duration = gameInfo.game_duration_minutes
        winner = gameInfo.winner
        loser = await self.getLoser(winner, gameInfo.player, gameInfo.opponent)
        if duration <= 300:
            achievement = await self.AchievementExists(1, loser)
            if achievement:
                cobj = models.AchievementPerUser(
                    user=loser,
                    achievement=achievement,
                )
                await sync_to_async(cobj.save)()
                await self.sendAchievement(achievement, loser)
        if duration <= 300:
            achievement = await self.AchievementExists(4, winner)
            if achievement:
                cobj = models.AchievementPerUser(
                    user=winner,
                    achievement=achievement,
                )
                await sync_to_async(cobj.save)()
                await self.sendAchievement(achievement, winner)
        if gameInfo.opponent_score == 0 or gameInfo.player_score == 0:
            achievement = await self.AchievementExists(2, loser)
            if achievement:
                cobj = models.AchievementPerUser(
                    user=loser,
                    achievement=achievement,
                )
                await sync_to_async(cobj.save)()
                await self.sendAchievement(achievement, loser)
        loser_score = await self.CheckOppscore(loser, gameInfo)
        if loser_score:
            achievement = await self.AchievementExists(14, winner)
            if achievement:
                cobj = models.AchievementPerUser(
                    user=winner,
                    achievement=achievement,
                )
                await sync_to_async(cobj.save)()
                await self.sendAchievement(achievement, winner)

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

            winner.points += winner.level * 300
            winner.coins += 30

            if winner.points >= winner.level * 1000:
                winner.coins += 10 * winner.level
                winner.level += 1
                winner.points = winner.points % 1000
                await sync_to_async(winner.save)(update_fields=['level'])
            await sync_to_async(winner.save)(update_fields=['points'])
            await sync_to_async(winner.save)(update_fields=['coins'])

            self.InviteObj.status = 'E'
            await sync_to_async(self.InviteObj.save)(update_fields=['status'])


            user.status = 'O'
            opp.status = 'O'
            await sync_to_async(user.save)(update_fields=['status'])
            await sync_to_async(opp.save)(update_fields=['status'])

            await sync_to_async(game.save)()
            await self.CollectAchievement(game)
        except Exception as e:
            print(f"Error in createGameObject: {e}")

    async def paddleChanges_(self):
        if self.rooms[self.room_group_name]['paddle1'].speed:
            message = {
                "type": "paddleChan",
                "index": self.rooms[self.room_group_name]['paddle1'].index,
                "posX": self.rooms[self.room_group_name]['paddle1'].posX,
                "posY": self.rooms[self.room_group_name]['paddle1'].posY,
            }
        if self.rooms[self.room_group_name]['paddle1'].speed:
            message = {
                "type": "paddleChan",
                "index": self.rooms[self.room_group_name]['paddle2'].index,
                "posX": self.rooms[self.room_group_name]['paddle2'].posX,
                "posY": self.rooms[self.room_group_name]['paddle2'].posY,
            }
        await self.custom_Async(message, "paddleChan")

    async def sendBallPos(self):
        await asyncio.sleep(3)
        self.date = timezone.now()
        while True:
            message = {
                "type": "ballPos",
                "BallX": self.rooms[self.room_group_name]['ball'].BallX,
                "BallY": self.rooms[self.room_group_name]['ball'].BallY,
            }
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
            if self.rooms[self.room_group_name]['paddle1'].score == 7:
                self.rooms[self.room_group_name]['winner'] = self.rooms[self.room_group_name]['paddle1'].name
                await self.createGameObject(self.rooms[self.room_group_name]['winner'])
                await self.stop_task()
            if self.rooms[self.room_group_name]['paddle2'].score == 7:
                self.rooms[self.room_group_name]['winner'] = self.rooms[self.room_group_name]['paddle2'].name
                await self.createGameObject(self.rooms[self.room_group_name]['winner'])
                await self.stop_task()
            await self.custom_Async(message, "ballPos")
            await self.paddleChanges_()
            await asyncio.sleep(1 / 30)

    async def stop_task(self):
        if self.task and not self.task.done():
            await self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass