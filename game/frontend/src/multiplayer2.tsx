import { useEffect, useState } from 'react';
import axios from 'axios';
import __tournament from './tournament';
import { useRecoilState } from 'recoil';

interface LocalGameProps {
	type: string;
	Name1: string;
	Name2: string;
}

function multiplayer2({type, Name1, Name2}: LocalGameProps) {
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
		player: string
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

	const [DataReady, StatusCode] = useState<boolean>(false);
	const [Exit, SetExit] = useState<boolean>(false);
	const [Exit2, SetSecExit] = useState<boolean>(false);
	const [finals, SetFinalExit] = useState<boolean>(false);

	useEffect(()=> {
		let timer: number = 0
		let StopGame = false
		const KEY_UP = 38
		const KEY_DOWN = 40
		const KEY_W = 87
		const KEY_S = 83
		const canvas = document.getElementById('canvas') as HTMLCanvasElement
		const Fscore = document.getElementById('Pscore')
		const Sscore = document.getElementById('Sscore')
		const winner = document.getElementById('winner')
		const buttons = document.getElementById('buttons')
		const retry = document.getElementById('retry')
		const score = document.getElementById('score')
		const counter = document?.getElementById('timer')
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

		function Paddles(this: any, pos: Vector, velocity: Vector, width: number, height: number, player: string): void {
			this.pos = pos
			this.velocity = velocity
			this.width = width
			this.height = height
			this.player = player
			this.score = 0

			this.update = function() {
				if (KeyPressed[KEY_UP] &&  this.pos.y >= 0)
					this.pos.y -= this.velocity.y
				if (KeyPressed[KEY_DOWN] && this.pos.y <= canvas.height)
					this.pos.y += this.velocity.y
			};

			this.updateP2 = function() {
				if (KeyPressed[KEY_W] &&  this.pos.y >= 0)
					this.pos.y -= this.velocity.y
				if (KeyPressed[KEY_S] && this.pos.y <= canvas.height)
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

		const ball = new (Ball as any)(TwoVect(canvas.width / 2, canvas.height / 2), TwoVect(15, 15), 10)

		const paddle1 = new (Paddles as any)(TwoVect(0, 50), TwoVect(20, 20), 20, 160, Name1)
		const paddle2 = new (Paddles as any)(TwoVect(canvas.width - 20, 550), TwoVect(20, 20), 20, 160, Name2)

		function BallIntersection(paddle: Paddles, ball: Ball) {
			let x1 = Math.abs(ball.pos.x - paddle.GetCenter().x)
			let y1 = Math.abs(ball.pos.y - paddle.GetCenter().y)
			if (x1 + 1 <= (ball.radius + paddle.HalfWidth()) && y1 + 1 <= (ball.radius + paddle.HalfHeight()))
				ball.velocity.x *= -1
		}

		function movingBallCursor(paddle: Paddles) {
			canvas.addEventListener('mousemove', function(e) {
				paddle.pos.y = e.clientY - 350
			})
		}

		function ResetBall(ball: Ball) {
			ball.pos.x = canvas.width / 2
			ball.pos.y = canvas.height / 2
			ball.velocity.x *= -1
			ball.velocity.y *= -1
		}
		
		function Score(ball: Ball, paddle1: Paddles, paddle2: Paddles) {
			if (ball?.pos.x <= -ball?.radius) {
				paddle2.score++
				Sscore!.innerHTML = paddle2.score.toString()
				ResetBall(ball)
			}
			if (ball?.pos.x >= canvas.width + ball?.radius) {
				paddle1.score++
				Fscore!.innerHTML = paddle1.score.toString()
				ResetBall(ball)
			}
		}

		function winGame(paddle: Paddles) {
			StopGame = true
			score!.style.display = 'none'
			canvas!.style.cursor = 'default'
			winner!.style.opacity = '1'
			buttons!.style.opacity = '1'
			buttons!.style.pointerEvents = 'visible'
			winner!.innerHTML = paddle.player
			if (type === 'local') {
				localStorage.setItem('FirstWinner', paddle.player)
				SetExit(true)
			}
			if (type === 'local2') {
				localStorage.setItem('SecondWinner', paddle.player)
				SetSecExit(true)
			}
			if (type === 'local3') {
				localStorage.setItem('winner', paddle.player)
				SetFinalExit(true)
			}
		}

		retry?.addEventListener('click', StartGame)

		function StartGame() {
			score!.style.display = 'flex'
			canvas!.style.cursor = 'none'
			winner!.style.opacity = '0'
			buttons!.style.opacity = '0'
			paddle1.score = 0
			paddle2.score = 0
			Sscore!.innerHTML = '0'
			Fscore!.innerHTML = '0'
			buttons!.style.pointerEvents = 'none'
			StopGame = false
			GameLoop()
		}

		function BallSettings(paddle1: Paddles, paddle2: Paddles) {
			if (paddle1.score >= 7)
				winGame(paddle1)
			if (paddle2.score >= 7)
				winGame(paddle2)
		}

		function GameUpdates() 
		{
			ball.update()
			WallCollision(ball)
			paddle1.updateP2()
			paddle2.update()
			PaddleCollision(paddle1)
			PaddleCollision(paddle2)
			BallIntersection(paddle1, ball)
			BallIntersection(paddle2, ball)
			Score(ball, paddle1, paddle2)
			BallSettings(paddle1, paddle2)
			movingBallCursor(paddle1)
		}

		function GameDraw() {
			ball.draw()
			paddle1.draw()
			paddle2.draw()
		}

		function GameLoop() {
			if (StopGame)
				return 
			context?.clearRect(0, 0, canvas.width, canvas.height)
			window.requestAnimationFrame(GameLoop)

			GameDraw()
			GameUpdates()
		}

		const exitStatus = setInterval(()=> {
			if (timer >= 3) {
				timer = 0
				GameLoop()
				counter!.style.display = 'none'
				clearInterval(exitStatus)
			}
			timer += 1
			counter!.innerHTML = timer.toString()
		}, 1000)

	}, [])

	// useEffect(()=> {
		// axios.defaults.withCredentials = true;
		// axios.get('http://localhost:8001/check/', {
		// 	withCredentials: true,	
		// })
		// .then(response=> {
		// 	if (response.status === 200)
		// 		StatusCode(true)
		// })
		// .catch(error=> {
		// 	console.log(error)
		// })
	// }, [])
	return (
		<div>
			{(!Exit && !Exit2 && !finals) &&
			<div className="game">
				<h1 id='timer' className='timer'></h1>
				<div className="play"></div>
				<div className="score" id='score'>
					<p id='Pscore'>0</p>
					<p id='Sscore'>0</p>
				</div>
				<div className="winner" id='winner'></div>
				<div id="buttons">
					<button id='retry'>retry</button>
					<button id='mods'>change Mods</button>
				</div>
				<canvas id="canvas"></canvas>
			</div>}
			{Exit && <__tournament NetType='local2'/>}
			{Exit2 && <__tournament NetType='local3'/>}
			{finals && <__tournament NetType='final'/>}
		</div>
	);
}

export default multiplayer2;