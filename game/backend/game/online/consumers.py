import json
from django.http import JsonResponse
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from . import views
import asyncio, time, subprocess

class GameConsumer(AsyncWebsocketConsumer):

    seconds = 0
    roomnb = 0
    data = ""
    rooms = {}

    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            self.username = user.username
            await self.accept()

        self.room_group_name = f'bertouch_{GameConsumer.roomnb}'

        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
            self.rooms[self.room_group_name] = {
                'players': {},
                'index': 0,
                'ball': views.Ball(67, 67, 7, 7, 10),
                'paddle2': views.Paddle(0, 20, 5, 5, 20, 160),
                'paddle1': views.Paddle(0, 50, 5, 5, 20, 160)
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
            "player": Index['index'],
        }))

        print('\nplayers: ', ThisRoom, '\nlen = ', Index['index'], '\nroomnb: ', GameConsumer.roomnb)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        if Index['index'] + 1 >= 3:
            GameConsumer.roomnb += 1

        if (Index['index'] == 2):
            asyncio.ensure_future(self.sendBallPos())

    async def disconnect(self, close_code):
        # del GameConsumer.connections[self]
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        infos = json.loads(text_data)
        message_type = infos.get("type")

        if message_type == "canvas":
            self.rooms[self.room_group_name]['ball'].BallX = infos["CanWidth"]
            self.rooms[self.room_group_name]['ball'].BallY = infos["CanHeight"]
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
                await self.custom_Async(message, "paddleChan")
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
        if message_type == 'it ends now':
            self.data += str('winner: ' + infos['winner'] + '\r\n')
            self.CreateCSVFile(self.data)

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )
    
    async def paddleChan(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "paddleChan", "message": message})
        )

    async def scored(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "scored", "message": message}))

    def CreateCSVFile(self, data):
        command = "/Users/mnassi/Desktop/1337/ft_transcendence/game/frontend/src/script/ai.sh \"" + data + "\"" 

        #result = subprocess.run(command, shell=True, capture_output=True, text=True)

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
            await self.rooms[self.room_group_name]['ball'].update()
            await self.rooms[self.room_group_name]['ball'].Ballinter()
            res = await self.rooms[self.room_group_name]['ball'].BallScored(self.rooms[self.room_group_name]['paddle1'], self.rooms[self.room_group_name]['paddle2'])
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle1'])
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle2'])
            await self.custom_Async(message, "ballPos")
            if res:
                message = {
                    "type": "scored",
                    "scorePlayer1": self.rooms[self.room_group_name]['paddle1'].score,
                    "scorePlayer2": self.rooms[self.room_group_name]['paddle2'].score,
                }
                await self.custom_Async(message, "scored")
            await self.rooms[self.room_group_name]['ball'].update()
            await self.rooms[self.room_group_name]['ball'].Ballinter()
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle1'])
            await views.BallIntersection(self.rooms[self.room_group_name]['ball'], self.rooms[self.room_group_name]['paddle2'])
            await asyncio.sleep(1 / 60)
            self.seconds += 1
            self.data += str(self.seconds) + 's= ' + ' BallX: ' + str(self.rooms[self.room_group_name]['ball'].BallX) + ' BallY: ' + str(self.rooms[self.room_group_name]['ball'].BallY) + ' paddleX1: ' + str(self.rooms[self.room_group_name]['paddle1'].posX) + ' paddleY1: ' + str(self.rooms[self.room_group_name]['paddle1'].posY) + ' paddleX2: ' + str(self.rooms[self.room_group_name]['paddle2'].posX) + ' paddleY2: ' + str(self.rooms[self.room_group_name]['paddle2'].posY) + '\r\n'


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
            return JsonResponse({'error': 'Not authenticated'})
        self.room_group_name = f"tournament_{self.RoomNb}"
        if self.room_group_name not in self.rooms:
            print(f' -> {self.room_group_name}')
            self.rooms[self.room_group_name] = {
                'players': {},
                'index': 0,
            }

        ThisRoom = self.rooms[self.room_group_name]['players']
        Index = self.rooms[self.room_group_name]

        userExist = False

        if self.username not in ThisRoom:
            Index['index'] += 1
            ThisRoom[self.username] = Index['index']
        else:
            ThisRoom[self.username] = Index['index']

        await self.send(text_data=json.dumps({
            'type': 'identify',
            'name': self.username,
            'player': self.rooms[self.room_group_name]['players'][self.username],
        }))

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        if Index['index'] + 1 >= 5:
            TournamentM_.RoomNb += 1

        print('\nplayers: ', ThisRoom, '\nlen = ', Index['index'], '\nroomnb: ', TournamentM_.RoomNb)

        if Index['index'] == 4:
            asyncio.ensure_future(self.StartTournament())

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )

    async def StartTournament(self):
        message = {
            'type': 'firstGame',
            'player1': '1',
            'player2': '2',
        }
        await self.custom_Async(message, 'firstGame')

    async def firstGame(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'firstGame',
            'message': message,
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)

        if (data['type'] == 'Player'):
            message = {
                'type': 'JoinedPlayers',
                'array': self.rooms[self.room_group_name]['players']
            }
            await self.custom_Async(message ,'JoinedPlayers')
        if data['type'] == 'SecondGame':
            message = {
                'type': 'SecondGame',
                'player1': '3',
                'player2': '4',
            }
            await self.custom_Async(message, 'SecondGame')
    
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

    async def disconnected(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'disconnected',
            'message': message,
        }))

    # async def disconnect(self, close_code):
        # if self in TournamentM_.Sockets:
        # CallSockets = self.rooms[self.room_group_name]['Sockets']
        # for i in range(1, 5):
        #     if self.players['name_' + str(i)]['name'] == self.username:
        #         self.players['name_' + str(i)]['name'] = '...'
        #         self.players['name_' + str(i)]['index'] = 0
        #         break
        # message = {
        #     'type': 'disconnected',
        #     'player': self.players
        # }
        # await self.custom_Async(message, 'disconnect'))
        # await self.channel_layer.group_discard(TournamentM_.room_group_name, self.channel_name)