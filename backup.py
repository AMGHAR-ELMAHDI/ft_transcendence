import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from . import views
import asyncio, time

ball = views.Ball(675.7, 675.7, 10, 10, 10)
paddle1 = views.Paddle(0, 50, 15, 15, 20, 160)
paddle2 = views.Paddle(0, 20, 15, 15, 20, 160)

class GameConsumer(WebsocketConsumer):
	connections = {}
	def connect(self):
		if len(GameConsumer.connections) + 1 == 3:
			return
		self.accept()
		self.index = len(GameConsumer.connections) + 1

		GameConsumer.connections[self] = self.index

		self.room_group_name = 'bertouch'

		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)

		self.send(text_data=json.dumps({
			'type': 'identify',
			'player': self.index,
		}))

	def custom_Async(self, message, type):
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': type,
				'message': message,
			}
		)

	def receive(self, text_data):
		# self.ballPos()
		infos = json.loads(text_data)
		message_type = infos.get('type')

		if message_type == 'canvas':
			ball.BallX = infos['CanWidth']
			ball.BallY = infos['CanHeight']
			paddle2.posX = infos['CanWidth'] - 20
		if message_type == 'paddleUpdates':
			if infos['user'] == '1':
				paddle1.update(infos['key'])
				message = {
					'type': 'paddleChan',
					'index': infos['user'],
					'posX': paddle1.posX,
					'posY': paddle1.posY,
				}
			self.custom_Async(message, 'paddleChan')
			if infos['user'] == '2':
				paddle2.update(infos['key'])
				message2 = {
					'type': 'paddleChan',
					'index': infos['user'],
					'posX': paddle2.posX,
					'posY': paddle2.posY,
				}
			self.custom_Async(message, 'paddleChan')

		message = {
			'type': 'ballPos',
			'BallX': ball.BallX,
			'BallY': ball.BallY,
		}
		self.custom_Async(message, 'ballPos')

	def paddleChan(self, event):
		message = event['message']

		self.send(text_data=json.dumps({
			'type': 'paddleChan',
			'message': message
		}))

	def ballPos(self, event):
		# while True:
		message = event['message']

		ball.update()
		ball.Ballinter()
		res = ball.BallScored(paddle1, paddle2)
		views.BallIntersection(ball, paddle1)
		views.BallIntersection(ball, paddle2)

		if res:
			self.send(text_data=json.dumps({
				'type': 'scored',
				'scorePlayer1': paddle2.score,
				'scorePlayer2': paddle1.score,
			}))

		self.send(text_data=json.dumps({
			'type': 'ballPos',
			'message': message
		}))
		# await self.custom_one(self, message)

		time.sleep(0.03)

	# def disconnect(self, close_code):
	# 	pass
			
class TournamentM_(WebsocketConsumer):
	def connect(self):
		self.accept()
	
	def receive(self, text_data):
		data = json.loads(text_data)

	def disconnect(self):
		pass