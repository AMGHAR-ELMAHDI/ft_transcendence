import json, requests
from django.http import JsonResponse
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async
from . import views
from . import models
import asyncio
from channels.db import database_sync_to_async

class GameConsumer(AsyncWebsocketConsumer):

    seconds = 0
    roomnb = 1
    data = ""
    rooms = {}
    task = ""

    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.username = user.username
            await self.accept()
        else:
            return JsonResponse({'error': 'The user is not Authenticated or the room is already started'}, status=403)

        self.room_group_name = f'bertouch_{GameConsumer.roomnb}'

        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
            self.rooms[self.room_group_name] = {
                'players': {},
                'index': 0,
                'ball': views.Ball(67, 67, 7, 7, 10),
                'paddle2': views.Paddle(0, 20, 5, 5, 20, 160),
                'paddle1': views.Paddle(0, 50, 5, 5, 20, 160),
                'winner': None,
            }

        ThisRoom = self.rooms[self.room_group_name]['players']
        Index = self.rooms[self.room_group_name]

        if self.username not in ThisRoom:
            Index['index'] += 1
            ThisRoom[self.username] = Index['index']
        else:
            ThisRoom[self.username] = Index['index']

        await self.send(text_data=json.dumps({
            "type": "identify",
            'roomId': self.room_group_name,
            "player": Index['index'],
            "name": self.username,
        }))

        print('\nplayers: ', ThisRoom, '\nlen = ', Index['index'], '\nroomnb: ', GameConsumer.roomnb)

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

            await asyncio.sleep(0.002)

        if message_type == 'it_ends_now':
            self.rooms[infos['room']]['winner'] = infos['winner']

            if not GameConsumer.roomnb % 3:
                TempOne = GameConsumer.roomnb - 1
                winner1 = self.rooms[f'bertouch_{TempOne - 1}']['winner']
                winner2 = self.rooms[f'bertouch_{TempOne}']['winner']

                if winner1 in self.rooms[f'bertouch_{TempOne - 1}']['players']:
                    index1 = self.rooms[f'bertouch_{TempOne - 1}']['players'][winner1]

                if winner2 in self.rooms[f'bertouch_{TempOne}']['players']:
                    index2 = self.rooms[f'bertouch_{TempOne}']['players'][winner2]

                if winner1 and winner2:
                    message = {
                        'type': 'winner',
                        'winner1': winner1,
                        'winner2': winner2,
                        'index1': index1,
                        'index2': index2,
                    }
                    await self.sendMultipleRooms(message, 'winner', TempOne - 1)
                    await self.sendMultipleRooms(message, 'winner', TempOne)

            if not (GameConsumer.roomnb - 1) % 3:
                TempOne = GameConsumer.roomnb - 1
                winner = self.rooms[f'bertouch_{TempOne}']['winner']

                if winner in self.rooms[f'bertouch_{TempOne}']['players']:
                    index = self.rooms[f'bertouch_{TempOne}']['players'][winner]

                message = {
                    'type': 'finals',
                    'winner': winner,
                    'index': index,
                }
                await self.sendMultipleRooms(message, 'winner', TempOne)

    async def stop_task(self):
        if self.task and not self.task.done():
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                print("Task cancellation confirmed")

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

    async def sendBallPos(self):
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
            if self.rooms[self.room_group_name]['paddle1'].score == 7 or self.rooms[self.room_group_name]['paddle2'].score == 7:
                await self.stop_task()
            await asyncio.sleep(1 / 60)


# tournament code here -->
class TournamentM_(AsyncWebsocketConsumer):
    RoomNb = 0
    rooms = {}       

    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.username = user.username
            await self.accept()
        else:
            return JsonResponse({'error': 'Not authenticated or The room is full'}, status=403)

        UserExist = False

        if TournamentM_.RoomNb > 0:
            for skey, value in self.rooms.items():
                for key in value['players']:
                    if key == self.username:
                        UserExist = True
                        TournamentM_.RoomNb -= 1
                        break

        self.room_group_name = f"tournament_{TournamentM_.RoomNb}"
        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
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

        ThisRoom = self.rooms[self.room_group_name]['players']
        Index = self.rooms[self.room_group_name]

        if self.username not in ThisRoom:
            Index['index'] += 1
            ThisRoom[self.username] = Index['index']
        else:
            pass

        await self.send(text_data=json.dumps({
            'type': 'identify',
            'name': self.username,
            'player': self.rooms[self.room_group_name]['players'][self.username],
        }))

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        if Index['index'] + 1 >= 5 and not UserExist:
            TournamentM_.RoomNb += 1

        print('\nplayers: ', ThisRoom, '\nlen = ', Index['index'], '\nroomnb: ', TournamentM_.RoomNb)

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )

    async def final(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'final',
            'message': message,
        }))


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
            self.rooms[self.room_group_name]['winner'] = data['winner']

        if self.rooms[self.room_group_name]['index'] == 4 and not self.rooms[self.room_group_name]['onceAtTime']:
            self.rooms[self.room_group_name]['onceAtTime'] = True
            asyncio.ensure_future(self.StartTournament())

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

    async def disconnect(self, close_code):
        user = self.scope['user']
        if user.is_authenticated:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)