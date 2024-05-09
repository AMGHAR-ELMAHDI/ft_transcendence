import { useEffect, useState } from 'react';
import { WinnerI } from './atoms/Winner';
import _LocalGame from './multiplayer2'
import _OnlineGame from './multiplayer'
import { useRecoilValue } from 'recoil';

import './tournament.css'
import './interface.css'

function _tournament() {
	return (
		<div className="tournCont">
			<div className="tournament">
				<div className="LeftJoin">
					<div className="first call">
						<h1>Me</h1>
					</div>
					<div className="second call">
						<h1>...</h1>
					</div>
				</div>
				<div className='void'></div>
				<img className='cup' src='/cup.svg'></img>
				<div className="middle">
					<div className="CupWinner">
						<h1>?</h1>
					</div>
					<span id="candidary">
						<div className="final_1">
							<h1>...</h1>
						</div>
						<div className="final_2">
							<h1>...</h1>
						</div>
					</span>
				</div>
				<div className="RightJoin">
					<div className="first call">
						<h1>...</h1>
					</div>
					<div className="second call">
						<h1>...</h1>
					</div>
				</div>
			</div>
		</div>
	)
}

function tournament(NetType: any) {

	const [run, SetRun] = useState<boolean>(false)
	const [secondRun, SetSecRun] = useState<boolean>(false)
	const [Final, SetFinal] = useState<boolean>(false)
	const [player1, setNameP] = useState<string>('...')
	const [player2, setNameP2] = useState<string>('...')
	const [FirstGame, RunFirstGame] = useState<boolean>(false)

	useEffect(()=> {
		const player_1 = document.querySelector('.LeftJoin .first')
		const player_2 = document.querySelector('.LeftJoin .second')
		const player_3 = document.querySelector('.RightJoin .first')
		const player_4 = document.querySelector('.RightJoin .second')
		const CupWinner = document.querySelector('.CupWinner')
		const final_1 = document.querySelector('.final_1')
		const final_2 = document.querySelector('.final_2')
		const AnimationWinner = document.querySelector('.void')

		const JsonData = localStorage.getItem('dataTn')
		const data = JSON.parse(JsonData!)

		if (NetType.NetType !== '') {
			player_1!.innerHTML = data.name_1
			player_2!.innerHTML = data.name_2
			player_3!.innerHTML = data.name_3
			player_4!.innerHTML = data.name_4
		}
		if (NetType.NetType === 'local') {
			setNameP(data.name_1)
			setNameP2(data.name_2)
			setTimeout(()=> SetRun(true), 3000)
		}
		if (NetType.NetType === 'local2') {
			const Winner = localStorage.getItem('FirstWinner')
			if (Winner !== '')
				final_1!.innerHTML = Winner!

			setNameP(data.name_3)
			setNameP2(data.name_4)
			setTimeout(()=> SetSecRun(true), 3000)
		}
		if (NetType.NetType === 'local3') {
			const Winner = localStorage.getItem('FirstWinner')
			if (Winner !== '')
				final_1!.innerHTML = Winner!
			const Winner2 = localStorage.getItem('SecondWinner')
			if (Winner2 !== '')
				final_2!.innerHTML = Winner2!

			setNameP(final_1?.textContent!)
			setNameP2(final_2?.textContent!)
			setTimeout(()=> SetFinal(true), 3000)
		}
		if (NetType.NetType === 'final') {
			const Winner = localStorage.getItem('FirstWinner')
			if (Winner !== '')
				final_1!.innerHTML = Winner!
			const Winner2 = localStorage.getItem('SecondWinner')
			if (Winner2 !== '')
				final_2!.innerHTML = Winner2!
			const Final = localStorage.getItem('winner')
			if (Final !== '')
				CupWinner!.innerHTML = Final!
			AnimationWinner?.classList.add('animate_winn')
		}
	}, [])

	const [Player1, setName] = useState<string>('p1')
	const [Player2, setName1] = useState<string>('p2')

	useEffect(()=> {
		var index = 0
		var name = ""
		var alphabets = 'abcdefghijklmnopqrstuvwxyz'
		const players = document.querySelectorAll('.call')
		for (let i = 0 ; i < 8; i++)
			name += alphabets[Math.floor(Math.random() * alphabets.length - 1)]
		if (NetType.NetType !== '') return

		function isWebSocketConnected(): boolean {
			return objSocket && objSocket.readyState === WebSocket.OPEN;
		}

		const objSocket = new WebSocket('ws://localhost:8000/ws/game/tn/')

		objSocket.onopen = function() {
			objSocket.send(JSON.stringify({
				'type': 'info',
				'name': name,
			}))
		}

		objSocket.onmessage = function(e) {
			const data = JSON.parse(e.data)
			const dataType = data.type

			if (dataType === 'identify') {
				index = data.player
				players[index - 1].innerHTML = name
			}
			if (dataType === 'firstGame')
				setTimeout(()=> RunFirstGame(true), 3000)
		}
	})

	return (
		<div className='VirParent'>
			{(!run && !secondRun && !Final && !FirstGame) && <_tournament/>}
			{run && <_LocalGame type='local' Name1={player1} Name2={player2}/>}
			{secondRun && <_LocalGame type='local2' Name1={player1} Name2={player2}/>}
			{Final && <_LocalGame type='local3' Name1={player1} Name2={player2}/>}
			{FirstGame && <_OnlineGame Name={Player1} Name2={Player2}/>}
		</div>
	)
}

export default tournament;