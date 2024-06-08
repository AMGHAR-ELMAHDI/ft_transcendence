from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

class Ball:
	def __init__(self, BallX, BallY, radius, VeclocityX, VeclocityY):
		self.BallX = BallX
		self.BallY = BallY
		self.initial_ballx = BallX
		self.initial_bally = BallY
		self.VeclocityX = VeclocityX
		self.VeclocityY = VeclocityY
		self.initial_velocityx = VeclocityX
		self.initial_velocityy = VeclocityY
		self.radius = radius
		self.canvasw = 1359
		self.canvash = 841

	async def Ballinter(self):
		if self.BallY + self.radius >= self.canvash or self.BallY - self.radius <= 0:
			self.VeclocityY *= -1

	async def resetBall(self):
		self.BallX = self.canvasw / 2
		self.BallY = self.canvash / 2
		self.VeclocityX *= -1
		self.VeclocityY *= -1

	async def reset(self):
		self.BallX = self.initial_ballx
		self.BallY = self.initial_bally
		self.VelocityX = self.initial_velocityx
		self.VelocityY = self.initial_velocityy

	async def BallScored(self, paddle1, paddle2):
		if self.BallX <= -self.radius and paddle2.score != 7 and paddle1.score != 7:
			paddle2.score += 1
			await self.resetBall()
			return True
		elif self.BallX >= self.canvasw + self.radius and paddle2.score != 7 and paddle1.score != 7:
			paddle1.score += 1
			await self.resetBall()
			return True
		else:
			return False

	async def update(self):
		self.BallX += self.VeclocityX
		self.BallY += self.VeclocityY


async def BallIntersection(ball, paddle):
	x1 = abs(ball.BallX - await paddle.GetCenterX())
	y1_top = abs(ball.BallY - (await paddle.GetCenterY() - await paddle.HalfHeight()))
	y1_bottom = abs(ball.BallY - (await paddle.GetCenterY() + await paddle.HalfHeight()))

	if x1 <= (ball.radius + await paddle.HalfWidth()):
		if y1_top <= ball.radius or y1_bottom <= ball.radius:
			ball.VeclocityY *= -1
	x1 = abs(ball.BallX - await paddle.GetCenterX())
	y1 = abs(ball.BallY - await paddle.GetCenterY())
	if (x1 + 1 <= (ball.radius + await paddle.HalfWidth()) and y1 + 1 <= (ball.radius + await paddle.HalfHeight())):
		ball.VeclocityX *= -1

class Paddle:
	def __init__(self, posX, posY, veloX, veloY, width, height):
		self.posX = posX
		self.posY = posY
		self.veloX = veloX
		self.veloY = veloY
		self.width = width
		self.height = height
		self.canvasw = 1359
		self.canvash = 841
		self.score = 0
	
	async def HalfWidth(self):
		return self.width / 2

	async def GetCenterX(self):
		return self.posX + await self.HalfWidth()

	async def GetCenterY(self):
		return self.posY + await self.HalfHeight()

	async def GetCenterXW(self):
		return self.posY + await self.HalfWidth()

	# def GetCenterYW(self):
	# 	return self.posY + self.HalfHeight()

	async def HalfHeight(self):
		return self.height / 2

	async def update(self, key):
		if (key == 'up' and self.posY >= 0):
			self.posY -= self.veloY
		if (key == 'down' and self.posY + self.height <= self.canvash):
			self.posY += self.veloY

def GetSession(request):
	winner1 = request.session.get('winner1')
	winner2 = request.session.get('winner2')
	if winner1 and winner2:
		return JsonResponse({'winner1': winner1, 'winner2': winner2})
	else:
		return JsonResponse({'error': 'session is empty'}, status=401)