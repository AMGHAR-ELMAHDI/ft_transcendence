import json
from django.http import JsonResponse
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from . import views
import asyncio, time, subprocess

class GameConsumer(AsyncWebsocketConsumer):

    ball = views.Ball(67, 67, 7, 7, 10)
    paddle1 = views.Paddle(0, 50, 5, 5, 20, 160)
    paddle2 = views.Paddle(0, 20, 5, 5, 20, 160)

    seconds = 0
    roomnb = 0
    data = ""
    connections = {}

    async def connect(self):
        if len(self.connections) + 1 >= 3:
            self.roomnb += 1
        await self.accept()
        self.index = len(self.connections) + 1
        GameConsumer.connections[self] = self.index
        self.room_group_name = f"bertouch_{self.roomnb}"
        print('-> ', self.room_group_name, '\nindex= ', self.index, '\nlen=',len(self.connections))
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.send(text_data=json.dumps({
            "type": "identify",
            "player": self.index,
        }))
        if (len(GameConsumer.connections) >= 2):
            asyncio.ensure_future(self.sendBallPos())

    async def disconnect(self, close_code):
        del GameConsumer.connections[self]
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        infos = json.loads(text_data)
        message_type = infos.get("type")

        if message_type == "canvas":
            self.ball.BallX = infos["CanWidth"]
            self.ball.BallY = infos["CanHeight"]
            self.paddle2.posX = infos["CanWidth"] - 20
        if message_type == "paddleUpdates":
            if infos["user"] == "1":
                self.paddle1.update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": self.paddle1.posX,
                    "posY": self.paddle1.posY,
                }
                await self.custom_Async(message, "paddleChan")
            if infos["user"] == "2":
                self.paddle2.update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": self.paddle2.posX,
                    "posY": self.paddle2.posY,
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

        # result = subprocess.run(command, shell=True, capture_output=True, text=True)

    async def ballPos(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "ballPos", "message": message}))

    async def sendBallPos(self):
        while True:
            message = {
                "type": "ballPos",
                "BallX": self.ball.BallX,
                "BallY": self.ball.BallY,
            }
            self.ball.update()
            self.ball.Ballinter()
            res = self.ball.BallScored(self.paddle1, self.paddle2)
            views.BallIntersection(self.ball, self.paddle1)
            views.BallIntersection(self.ball, self.paddle2)
            await self.custom_Async(message, "ballPos")
            if res:
                message = {
                    "type": "scored",
                    "scorePlayer1": self.paddle1.score,
                    "scorePlayer2": self.paddle2.score,
                }
                await self.custom_Async(message, "scored")
            self.ball.update()
            self.ball.Ballinter()
            views.BallIntersection(self.ball, self.paddle1)
            views.BallIntersection(self.ball, self.paddle2)
            await asyncio.sleep(1 / 60)
            self.seconds += 1
            self.data += str(self.seconds) + 's= ' + ' BallX: ' + str(self.ball.BallX) + ' BallY: ' + str(self.ball.BallY) + ' paddleX1: ' + str(self.paddle1.posX) + ' paddleY1: ' + str(self.paddle1.posY) + ' paddleX2: ' + str(self.paddle2.posX) + ' paddleY2: ' + str(self.paddle2.posY) + '\r\n'


# tournament code here -->
class TournamentM_(AsyncWebsocketConsumer):
    Sockets = {}
    players = {
        'name_1' : {
            'name': '...',
            'index': 0,
        },
        'name_2' : {
            'name': '...',
            'index': 0,
        },
        'name_3' : {
            'name': '...',
            'index': 0,
        },
        'name_4' : {
            'name': '...',
            'index': 0,
        },
    }
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
            self.rooms[self.room_group_name] = {
                'Sockets': {},
            }

        CallSockets = self.rooms[self.room_group_name]['Sockets']

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        userExist = False
        TheKey = None

        for key, value in self.players.items():
            if value['name'] == self.username:
                userExist = True
                TheKey = key
                break

        if userExist:
            self.rooms[self.room_group_name]['Sockets'][self] = self.players[TheKey]['index']
            CallSockets[self] = self.rooms[self.room_group_name]['Sockets'][self]
            SocketIndex = self.rooms[self.room_group_name]['Sockets'][self]
            print(f'exist---> {self.username} -> {SocketIndex} -> len : {len(CallSockets)}')
            await self.send(text_data=json.dumps({
                'type': 'identify',
                'name': self.username,
                'player': self.players[TheKey]['index'],
            }))
        elif not userExist:
            self.rooms[self.room_group_name]['Sockets'][self] = len(CallSockets) + 1
            CallSockets[self] = self.rooms[self.room_group_name]['Sockets'][self]
            if len(CallSockets) + 1 >= 5:
                self.RoomNb += 1
            SocketIndex = self.rooms[self.room_group_name]['Sockets'][self]
            print(f'not exits->> {self.username} -> {SocketIndex} -> len : {len(CallSockets)}')
            await self.send(text_data=json.dumps({
                'type': 'identify',
                'name': self.username,
                'player': self.rooms[self.room_group_name]['Sockets'][self],
            }))

        if len(CallSockets) == 4:
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
            self.players['name_' + str(data['index'])]['name'] = data['name']
            self.players['name_' + str(data['index'])]['index'] = data['index']
            message = {
                'type': 'JoinedPlayers',
                'array': self.players
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

    async def disconnect(self, close_code):
        # if self in TournamentM_.Sockets:
        CallSockets = self.rooms[self.room_group_name]['Sockets']
        for i in range(1, 5):
            if self.players['name_' + str(i)]['name'] == self.username:
                self.players['name_' + str(i)]['name'] = '...'
                self.players['name_' + str(i)]['index'] = 0
                break
        # message = {
        #     'type': 'disconnected',
        #     'player': self.players
        # }
        # await self.custom_Async(message, 'disconnect')
        print('before: ', len(CallSockets))
        if self in CallSockets:
            del CallSockets[self]
        print('after: ', len(CallSockets))
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)