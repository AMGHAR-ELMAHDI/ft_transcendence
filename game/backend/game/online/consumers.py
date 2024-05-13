import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from . import views
import asyncio, time, subprocess

ball = views.Ball(675.7, 675.7, 10, 10, 10)
paddle1 = views.Paddle(0, 50, 5, 5, 20, 160)
paddle2 = views.Paddle(0, 20, 5, 5, 20, 160)


class GameConsumer(AsyncWebsocketConsumer):

    connections = {}
    seconds = 0
    data = ""

    async def connect(self):
        if len(GameConsumer.connections) + 1 == 3:
            return
        await self.accept()
        self.index = len(GameConsumer.connections) + 1
        GameConsumer.connections[self] = self.index
        self.room_group_name = "bertouch"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.send(text_data=json.dumps({
            "type": "identify",
            "player": self.index,
        }))
        if (len(GameConsumer.connections) == 2):
            asyncio.ensure_future(self.sendBallPos())

    async def disconnect(self, close_code):
        del GameConsumer.connections[self]
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        infos = json.loads(text_data)
        message_type = infos.get("type")

        if message_type == "canvas":
            ball.BallX = infos["CanWidth"]
            ball.BallY = infos["CanHeight"]
            paddle2.posX = infos["CanWidth"] - 20
        if message_type == "paddleUpdates":
            if infos["user"] == "1":
                paddle1.update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": paddle1.posX,
                    "posY": paddle1.posY,
                }
                await self.custom_Async(message, "paddleChan")
            if infos["user"] == "2":
                paddle2.update(infos["key"])
                message = {
                    "type": "paddleChan",
                    "index": infos["user"],
                    "posX": paddle2.posX,
                    "posY": paddle2.posY,
                }
                await self.custom_Async(message, "paddleChan")
            await asyncio.sleep(0.002)
        if message_type == 'it ends now':
            self.data += 'winner: ' + infos['winner'] + '\r\n'
            self.CreateCSVFile(self.data)

    async def custom_Async(self, message, type):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": type,
                "message": message,
            },
        )

    async def sendBallPos(self):
        while True:
            message = {
                "type": "ballPos",
                "BallX": ball.BallX,
                "BallY": ball.BallY,
            }
            ball.update()
            ball.Ballinter()
            res = ball.BallScored(paddle1, paddle2)
            views.BallIntersection(ball, paddle1)
            views.BallIntersection(ball, paddle2)
            await self.custom_Async(message, "ballPos")
            if res:
                message = {
                    "type": "scored",
                    "scorePlayer1": paddle1.score,
                    "scorePlayer2": paddle2.score,
                }
                await self.custom_Async(message, "scored")
            await asyncio.sleep(1 / 60)
            self.seconds += 1
            self.data += str(self.seconds) + 's= ' + ' BallX: ' + str(ball.BallX) + ' BallY: ' + str(ball.BallY) + ' paddleX1: ' + str(paddle1.posX) + ' paddleY1: ' + str(paddle1.posY) + ' paddleX2: ' + str(paddle2.posX) + ' paddleY2: ' + str(paddle2.posY) + '\r\n'

    async def paddleChan(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"type": "paddleChan", "message": message})
        )

    async def ballPos(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "ballPos", "message": message}))

    async def scored(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "scored", "message": message}))

    def CreateCSVFile(self, data):
        command = "/Users/mnassi/Desktop/1337/ft_transcendence/game/frontend/src/script/ai.sh \"" + data + "\"" 

        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print(result)


# tournament code here -->
class TournamentM_(AsyncWebsocketConsumer):
    connections = {}
    players = {
        'name_1': '...',
        'name_2': '...',
        'name_3': '...',
        'name_4': '...',
    }

    async def connect(self):
        if len(TournamentM_.connections) + 1 == 5:
            return
        await self.accept()
        self.index = len(TournamentM_.connections) + 1
        TournamentM_.connections[self] = self.index
        self.room_group_name = "bertouch"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.send(text_data=json.dumps({
            'type': 'identify',
            'player': self.index,
        }))

        if len(TournamentM_.connections) == 4:
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
        print('dkhal')
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
            self.players['name_' + str(data['index'])] = data['name']
            message = {
                'type': 'JoinedPlayers',
                'array': self.players
            }
            await self.custom_Async(message ,'JoinedPlayers')
    
    async def JoinedPlayers(self, event):
        message = event['message']
        await self.send(json.dumps({
            'type': 'JoinedPlayers',
            'message': message
        }))