import { useEffect, useState } from 'react';
import './interface.css'

function game2D() {
	interface Vector {
		x: number
		y: number
	}

	interface Paddles {
		pos: Vector
		velocity: Vector
		height: number
		width: number
		score: number
		HalfWidth(): number
		HalfHeight(): number
		GetCenter(): Vector
	}

	interface Ball {
		pos: Vector
		velocity: Vector
		radius: number
	}

	const [PLAYER_1, GetFirst] = useState('PLAYER1');
	const [PLAYER_2, GetSecond] = useState('PLAYER2');

	let [SCORE_P1, GetScoreP1] = useState<number>(0);
	let [SCORE_P2, GetScoreP2] = useState<number>(0);

	useEffect(()=> {
		const KEY_UP = 38
		const KEY_DOWN = 40
		const canvas = document.getElementById('canvas') as HTMLCanvasElement
		const Fscore = document.getElementById('Pscore')
		const Sscore = document.getElementById('Sscore')
		const context = canvas.getContext('2d')
		
		const KeyPressed: any[] = [];

		window.addEventListener('keydown', function(e) {
			KeyPressed[e.keyCode] = true;
		})
		window.addEventListener('keyup', function(e) {
			KeyPressed[e.keyCode] = false;
		})
		function changeCanvasSize(newWidth: number, newHeight: number) {
			canvas.width = newWidth;
			canvas.height = newHeight;
		}
		function FillColor(color: string) {
			context!.fillStyle = color
		}
		function TwoVect(x: number, y: number) {
			return {x: x, y: y}
		}

		changeCanvasSize(1359, 841);

		function Paddles(this: any, pos: Vector, velocity: Vector, width: number, height: number): void {
			this.pos = pos
			this.velocity = velocity
			this.width = width
			this.height = height
			this.score = 0

			this.update = function() {
				if (KeyPressed[KEY_UP] &&  this.pos.y >= 0)
					this.pos.y -= this.velocity.y
				if (KeyPressed[KEY_DOWN] && this.pos.y <= canvas.height)
					this.pos.y += this.velocity.y
			};

			this.draw = function() {
				FillColor("#ffffff")
				context!.lineJoin = 'round';
				context?.fillRect(pos.x, pos.y, width, height)
			}
			this.HalfWidth = function() {
				return this.width / 2
			}
			this.HalfHeight = function() {
				return this.height / 2
			}
			this.GetCenter = function() {
				return TwoVect(
					this.pos.x + this.HalfWidth(),
					this.pos.y + this.HalfHeight(),
				)
			}
		}

		function PaddleCollision(paddle1: Paddles): void {
			if (paddle1.pos.y <= 0)
				paddle1.pos.y = 0
			if (paddle1.pos.y + paddle1.height >= canvas.height)
				paddle1.pos.y = canvas.height - paddle1.height
		}

		window.addEventListener('mousemove', function(e) {
			paddle1.pos.y = e.clientY
		})

		function Ball(this: any, pos: Vector, velocity: Vector, radius: number) {
			this.pos = pos
			this.velocity = velocity
			this.radius = radius

			this.update = function() {
				this.pos.x += this.velocity.x
				this.pos.y += this.velocity.y
			};
			this.draw = function() {
				FillColor("#ffffff")
				context?.beginPath()
				context?.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
				context?.fill()
			}
		}

		function WallCollision(ball: Ball) {
			if (ball.pos.y + ball.radius >= canvas.height || ball.pos.y - ball.radius <= 0)
				ball.velocity.y *= -1
		}

		const ball = new (Ball as any)(TwoVect(canvas.width / 2, canvas.height / 2), TwoVect(5, 5), 10)

		const paddle1 = new (Paddles as any)(TwoVect(0, 50), TwoVect(10, 10), 20, 160)
		const paddle2 = new (Paddles as any)(TwoVect(canvas.width - 20, 20), TwoVect(10, 10), 20, 160)

		function BallIntersection(paddle: Paddles, ball: Ball) {
			let x1 = Math.abs(ball.pos.x - paddle.GetCenter().x)
			let y1 = Math.abs(ball.pos.y - paddle.GetCenter().y)
			if (x1 <= (ball.radius + paddle.HalfWidth()) && y1 <= (ball.radius + paddle.HalfHeight()))
				ball.velocity.x *= -1
		}

		function AIPLayer(ball: Ball, AI: Paddles) {
			if (ball.velocity.x > 0) {
				if (ball.pos.y > AI.pos.y) {
					AI.pos.y += AI.velocity.y
					if (AI.pos.y + AI.height >= canvas.height)
						AI.pos.y = canvas.height - AI.height 
				}
				if (ball.pos.y < AI.pos.y) {
					AI.pos.y -= AI.velocity.y
					if (AI.pos.y <= 0)
						AI.pos.y = 0
				}
			}
		}

		function ResetBall(ball: Ball) {
			if (ball.velocity.x > 0) {
				ball.pos.x = canvas.width - 150
				ball.pos.y = (Math.random() * (canvas.height - 200)) + 100
			}
			if (ball.velocity.x < 0) {
				ball.pos.x = 150
				ball.pos.y = (Math.random() * (canvas.height - 200)) + 100
			}
			ball.velocity.x *= -1
			ball.velocity.y *= -1
		}

		function Score(ball: Ball, paddle1: Paddles, paddle2: Paddles) { // let animation first
			if (ball.pos.x <= -ball.radius) {
				paddle2.score += 1;
				Sscore!.innerHTML = paddle2.score.toString()
				ResetBall(ball)
			}
			if (ball.pos.x >= canvas.width + ball.radius) {
				paddle1.score += 1
				Fscore!.innerHTML = paddle1.score.toString()
				ResetBall(ball)
			}
		}



		function GameUpdates() {
			ball.update()
			WallCollision(ball)
			paddle1.update()
			PaddleCollision(paddle1)
			PaddleCollision(paddle2)
			BallIntersection(paddle1, ball)
			BallIntersection(paddle2, ball)
			AIPLayer(ball, paddle2)
			Score(ball, paddle1, paddle2)
		}

		function GameDraw() {
			ball.draw()
			paddle1.draw()
			paddle2.draw()
		}

		function GameLoop() {
			context?.clearRect(0, 0, canvas.width, canvas.height)
			window.requestAnimationFrame(GameLoop)

			GameDraw()
			GameUpdates()
		}

		GameLoop()
	})
	return (
		<div className="container">
			<div className="header">
				<img id='logo' src="/logo.png"></img>
				<h1 className='text'>{PLAYER_1} vs {PLAYER_2}</h1>
				<img id='user-avatar' src="/logo.png"></img>
			</div>
			<div className="game">
				<div className="play"></div>
				<div className="score">
					<p id='Pscore'>{SCORE_P1}</p>
					<p id='Sscore'>{SCORE_P2}</p>
				</div>
				<canvas id="canvas"></canvas>
			</div>
		</div>
	);
}

export default game2D;