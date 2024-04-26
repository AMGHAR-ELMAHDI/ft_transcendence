from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

class Ball:
	def __init__(self, BallX, BallY, radius, VeclocityX, VeclocityY):
		self.BallX = BallX
		self.BallY = BallY
		self.VeclocityX = VeclocityX
		self.VeclocityY = VeclocityY
		self.radius = radius
		self.canvasw = 1359
		self.canvash = 841
	
	def Ballinter(self):
		if self.BallY + self.radius >= self.canvash or self.BallY - self.radius <= 0:
			self.VeclocityY *= -1

	def resetBall(self):
		self.BallX = self.canvasw / 2
		self.BallY = self.canvash / 2
		self.VeclocityX *= -1
		self.VeclocityY *= -1

	def BallScored(self, paddle1, padddl2):
		if self.BallX <= -self.radius:
			paddle1.score += 1
			self.resetBall()
			return True
		if  self.BallX >= self.canvasw + self.radius:
			padddl2.score += 1
			self.resetBall()
			return True
		return False

	def update(self):
		self.BallX += self.VeclocityX
		self.BallY += self.VeclocityY


def BallIntersection(ball, paddle):
	x1 = abs(ball.BallX - paddle.GetCenterX())
	y1 = abs(ball.BallY - paddle.GetCenterY())
	if (x1 + 1 <= (ball.radius + paddle.HalfWidth()) and y1 + 1 <= (ball.radius + paddle.HalfHeight())):
		ball.VeclocityX *= -1
	x1 = abs(ball.BallX - paddle.GetCenterX())
	y1_top = abs(ball.BallY - (paddle.GetCenterY() - paddle.HalfHeight()))
	y1_bottom = abs(ball.BallY - (paddle.GetCenterY() + paddle.HalfHeight()))

	if x1 <= (ball.radius + paddle.HalfWidth()):
		if y1_top <= ball.radius or y1_bottom <= ball.radius:
			ball.VeclocityY *= -1
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
	
	def HalfWidth(self):
		return self.width / 2

	def GetCenterX(self):
		return self.posX + self.HalfWidth()

	def GetCenterY(self):
		return self.posY + self.HalfHeight()

	def GetCenterXW(self):
		return self.posY + self.HalfWidth()

	# def GetCenterYW(self):
	# 	return self.posY + self.HalfHeight()

	def HalfHeight(self):
		return self.height / 2

	def update(self, key):
		if (key == 'up' and self.posY >= 0):
			self.posY -= self.veloY
		if (key == 'down' and self.posY + self.height <= self.canvash):
			self.posY += self.veloY