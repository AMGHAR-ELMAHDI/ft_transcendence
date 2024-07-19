import json, requests
from django.http import JsonResponse
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from . import views
from userman import models
import asyncio, jwt

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

class GameConsumer(AsyncWebsocketConsumer):

    seconds = 0
    roomnb = 1
    finalnb = 3
    data = ""
    rooms = {}
    task = ""
    date = ""
    end_date = ""

    async def Qualification(self, index):
        while True:
            GameConsumer.roomnb = index
            tempRoom = f'bertouch_{index}'
            if tempRoom not in self.rooms and (GameConsumer.roomnb % 3 == 1 or GameConsumer.roomnb % 3 == 2):
                self.room_group_name = tempRoom
                break
            index += 1

    async def FinalGame(self):
        tempRoom = f'bertouch_{GameConsumer.finalnb}'

        if tempRoom in self.rooms and self.rooms[tempRoom]['index'] + 1 >= 3:
            GameConsumer.finalnb += 3
            tempRoom = f'bertouch_{GameConsumer.finalnb}'
        self.room_group_name = tempRoom

    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        user = await getUser(self.token)
        if user:
            self.username = user.username
            self.status = user.status
            await self.accept()
        else:
            await self.close(401)

        UserExist = False

        if GameConsumer.roomnb > 1:
            for skey, value in self.rooms.items():
                for key in value['players']:
                    if key == self.username and self.status == 'I':
                        UserExist = True
                        self.room = skey

        if not GameConsumer.roomnb % 3:
            GameConsumer.roomnb += 1

        if UserExist and self.rooms[self.room]['rank'] == 'semi-final':
            await self.FinalGame()
        else:
            self.room_group_name = f'bertouch_{GameConsumer.roomnb}'

        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
            self.rooms[self.room_group_name] = {
                'players': {},
                'index': 0,
                'ball': views.Ball(67, 67, 7, 8, 8),
                'paddle2': views.Paddle(0, 20, 1, 1, 20, 160),
                'paddle1': views.Paddle(0, 50, 1, 1, 20, 160),
                'winner': None,
                'rank': None,
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

        # print('\nplayers: ', ThisRoom, '\nlen = ', Index['index'], '\nroomnb: ', GameConsumer.roomnb)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        if Index['index'] + 1 >= 3:
            GameConsumer.roomnb += 1

        if (Index['index'] == 2):
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
            await self.custom_Async(message, "paddleChan")

        if message_type == 'it_ends_now':
            roomName = infos['room']
            pos = roomName.find('_')
            roomId = roomName[pos + 1:len(roomName)]
            TempOne = int(roomId)

            if ((TempOne + 1) % 3 == 0 and self.rooms[f'bertouch_{TempOne - 1}']['winner'] != None) or ((TempOne + 2) % 3 == 0 and self.rooms[f'bertouch_{TempOne + 1}']['winner'] != None):
                if (TempOne + 2) % 3 == 0:
                    TempOne += 1
                winner1 = self.rooms[f'bertouch_{TempOne - 1}']['winner']
                winner2 = self.rooms[f'bertouch_{TempOne}']['winner']

                self.rooms[f'bertouch_{TempOne}']['rank'] = 'semi-final'
                self.rooms[f'bertouch_{TempOne - 1}']['rank'] = 'semi-final'

                if winner1 in self.rooms[f'bertouch_{TempOne - 1}']['players'] and winner2 in self.rooms[f'bertouch_{TempOne}']['players']:
                    print('->dkhal', 'room 1: ', TempOne - 1, 'room 2: ', TempOne )
                    index_1 = self.rooms[f'bertouch_{TempOne - 1}']['players'][winner1]
                    index_2 = self.rooms[f'bertouch_{TempOne}']['players'][winner2]

                    message = {
                        'type': 'winner',
                        'winner1': winner1,
                        'winner2': winner2,
                        'index1': index_1,
                        'index2': index_2,
                    }
                    await self.sendMultipleRooms(message, 'winner', TempOne - 1)
                    await self.sendMultipleRooms(message, 'winner', TempOne)

            if not TempOne % 3:
                print('->>', TempOne)
                winner = self.rooms[f'bertouch_{TempOne}']['winner']

                if winner in self.rooms[f'bertouch_{TempOne}']['players']:
                    index = self.rooms[f'bertouch_{TempOne}']['players'][winner]

                for i in range(TempOne - 2, TempOne + 1):
                    self.rooms[f'bertouch_{i}']['rank'] = 'final'

                message = {
                    'type': 'finals',
                    'winner': winner,
                    'index': index,
                    'game': self.room_group_name,
                }
                GameConsumer.roomnb -= 1

                await self.sendMultipleRooms(message, 'winner', TempOne)

    async def createTnObject(self, TempOne):
        FirstGame_id = await sync_to_async(get_object_or_404)(models.GameHistory, id=self.rooms[f'bertouch_{TempOne - 2}']['id'])
        SecondGame_id = await sync_to_async(get_object_or_404)(models.GameHistory, id=self.rooms[f'bertouch_{TempOne - 1}']['id'])
        FinalGame_id = await sync_to_async(get_object_or_404)(models.GameHistory, id=self.rooms[f'bertouch_{TempOne}']['id'])

        tournament = models.Tournament(
            game_01_id=FirstGame_id,
            game_02_id=SecondGame_id,
            game_final_id=FinalGame_id,
        )

        await sync_to_async(tournament.save)()

    async def sendMultipleRooms(self, message, type, roomnb):
        await self.channel_layer.group_send(
            f'bertouch_{roomnb}',
            {
                "type": type,
                "message": message,
            },
        )

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
        # try:
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
                game_mode='T',
                game_duration_minutes=duration.total_seconds()
            )

            winner.points += winner.level * 300
            winner.coins += 30

            if winner.points >= winner.level * 1000:
                winner.coins += 10 * winner.level
                winner.level += 1
                winner.points -= 1000
                await sync_to_async(winner.save)(update_fields=['level'])
            await sync_to_async(winner.save)(update_fields=['points'])
            await sync_to_async(winner.save)(update_fields=['coins'])

            await sync_to_async(game.save)()
            self.rooms[self.room_group_name]['id'] = game.id

            pos = self.room_group_name.find('_')
            roomId = self.room_group_name[pos + 1:len(self.room_group_name)]

            await self.CollectAchievement(game)

            if not int(roomId) % 3:
                await self.createTnObject(int(roomId))
                # print('after->')

        # except Exception as e:
        #     print(f"Error in createGameObject: {e}")

    async def sendBallPos(self):
        await asyncio.sleep(3)
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
            await asyncio.sleep(1 / 65)

    async def stop_task(self):
        if self.task and not self.task.done():
            await self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

# tournament code here -->
class TournamentM_(AsyncWebsocketConsumer):
    RoomNb = 0
    rooms = {}
    alias = ""
    task = ""
    room_name = ""
    instance = ""

    @database_sync_to_async
    def CreateObject(self):
        try:
            object = models.TnRooms(
                name=self.room_group_name,
                status='Q',
                players=1,
            )
            object.save()
        except IntegrityError:
            pass

    @database_sync_to_async
    def getObject(self):
        instance = models.TnRooms.objects.get(name=self.room_group_name)
        return instance

    async def connect(self):
        self.token = self.scope['url_route']['kwargs']['token']
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if not self.room_name:
            self.room_name = f"tournament_{TournamentM_.RoomNb}"
        user = await getUser(self.token)
        if user:
            self.username = user.username
            self.status = user.status
            await self.accept()
        else:
            self.close(status=401)

        UserExist = False

        if len(self.rooms) > 0:
            for skey, value in self.rooms.items():
                for key in value['players']:
                    if key == self.username and (self.status == 'I' or self.rooms[skey]['winner'] == ''):
                        if skey != self.room_name and self.rooms[skey]['winner'] == '':
                            print(skey, ' ', self.room_name)
                            await self.send(text_data=json.dumps({
                                'type': 'error',
                                'error': 'finish this tournament first',
                                'room_name': skey,
                            }))
                        UserExist = True
                        self.room_group_name = skey

        if not UserExist:
            self.room_group_name = self.room_name

        if self.room_group_name not in self.rooms:
            self.rooms[self.room_group_name] = {
                'players': {},
                'Joined': {
                    'name_1': {
                        'name': '...',
                    },
                    'name_2': {
                        'name': '...',
                    },
                    'name_3': {
                        'name': '...',
                    },
                    'name_4': {
                        'name': '...',
                    },
                },
                'index': 0,
                'onceAtTime': False,
                'final1': '',
                'final2': '',
                'winner': ''
            }
        
        await self.CreateObject()
        self.instance = await self.getObject()

        ThisRoom = self.rooms[self.room_group_name]['players']
        Index = self.rooms[self.room_group_name]

        if self.username not in ThisRoom:
            Index['index'] += 1
            self.instance.players = Index['index']
            await sync_to_async(self.instance.save)(update_fields=['players'])
            if Index['index'] == 4:
                TournamentM_.RoomNb += 1
            ThisRoom[self.username] = Index['index']

        print(f' -> {self.room_group_name}, {ThisRoom}')

        await self.send(text_data=json.dumps({
            'type': 'identify',
            'name': self.username,
            'player': self.rooms[self.room_group_name]['players'][self.username],
        }))

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if (data['type'] == 'Player'):
            for key, value in self.rooms[self.room_group_name]['players'].items():
                self.rooms[self.room_group_name]['Joined'][f'name_{value}'] = {'name': key}
            message = {
                'type': 'JoinedPlayers',
                'array': self.rooms[self.room_group_name]['Joined'],
                'final1': self.rooms[self.room_group_name]['final1'],
                'final2': self.rooms[self.room_group_name]['final2'],
                'winner': self.rooms[self.room_group_name]['winner'],
            }
            await self.custom_Async(message ,'JoinedPlayers')

        if (data['type'] == 'Qualifiers'):
            self.rooms[self.room_group_name]['final1'] = data['field1']
            self.rooms[self.room_group_name]['final2'] = data['field2']

        if (data['type'] == 'EndTournament'):
            for key, value in self.rooms[self.room_group_name]['players'].items():
                user = await sync_to_async(models.Player.objects.get)(username=key)
                user.status = 'O'
                await sync_to_async(user.save)(update_fields=['status'])
            self.instance.status = 'E'
            await sync_to_async(self.instance.save)(update_fields=['status'])
            self.rooms[self.room_group_name]['winner'] = data['winner']
            await self.stop_task()

        if not self.rooms[self.room_group_name]['onceAtTime'] and len(self.rooms[self.room_group_name]['players']) == 4:
            for key, value in self.rooms[self.room_group_name]['players'].items():
                user = await sync_to_async(models.Player.objects.get)(username=key)
                user.status = 'I'
                await sync_to_async(user.save)(update_fields=['status'])
            await self.custom_Async({'type': 'soon'}, 'soon')
            self.instance.status = 'S'
            await sync_to_async(self.instance.save)(update_fields=['status'])
            self.rooms[self.room_group_name]['onceAtTime'] = True
            player = self.rooms[self.room_group_name]['players']
            self.task = asyncio.ensure_future(self.StartTournament())

    async def StartTournament(self):
        message = {
            'type': 'firstGame',
            'player1': '1',
            'player2': '2'
        }
        message2 = {
            'type': 'SecondGame',
            'player1': '3',
            'player2': '4'
        }
        await self.custom_Async(message, 'firstGame')
        await self.custom_Async(message2, 'SecondGame')

    async def soon(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'soon',
            'message': message,
        }))

    async def firstGame(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'firstGame',
            'message': message,
        }))
    
    async def JoinedPlayers(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'JoinedPlayers',
            'message': message,
        }))

    async def SecondGame(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'SecondGame',
            'message': message,
        }))

    async def stop_task(self):
        if self.task and not self.task.done():
            await self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)