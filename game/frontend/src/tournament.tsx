import { useEffect, useState } from 'react';
import { PlayerId } from './atoms/Winner';
import _LocalGame from './multiplayer2'
import _title from './title'
import _OnlineGame from './multiplayer'
import { useRecoilState, useRecoilValue } from 'recoil';

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

interface OnlineGame {
	NetType: string;
	Name: string;
}

function tournament({NetType, Name}: OnlineGame) {

	const [run, SetRun] = useState<boolean>(false)
	const [secondRun, SetSecRun] = useState<boolean>(false)
	const [Final, SetFinal] = useState<boolean>(false)
	const [player1, setNameP] = useState<string>('...')
	const [player2, setNameP2] = useState<string>('...')
	const [FirstGame, RunFirstGame] = useState<boolean>(false)
	const [SecGame, RunSecGame] = useState<boolean>(false)

	useEffect(()=> {
		const player_1 = document.querySelector('.LeftJoin .first')
		const player_2 = document.querySelector('.LeftJoin .second')
		const player_3 = document.querySelector('.RightJoin .first')
		const player_4 = document.querySelector('.RightJoin .second')
		const CupWinner = document.querySelector('.CupWinner')
		const final_1 = document.querySelector('.final_1')
		const final_2 = document.querySelector('.final_2')
		const AnimationWinner = document.querySelector('.void')

		if (NetType === '')
			return
		const JsonData = localStorage.getItem('dataTn')
		const data = JSON.parse(JsonData!)

		player_1!.innerHTML = data.name_1
		player_2!.innerHTML = data.name_2
		player_3!.innerHTML = data.name_3
		player_4!.innerHTML = data.name_4

		if (NetType === 'local') {
			setNameP(data.name_1)
			setNameP2(data.name_2)
			setTimeout(()=> SetRun(true), 3000)
		}
		if (NetType === 'local2') {
			const Winner = localStorage.getItem('FirstWinner')
			if (Winner !== '')
				final_1!.innerHTML = Winner!

			setNameP(data.name_3)
			setNameP2(data.name_4)
			setTimeout(()=> SetSecRun(true), 3000)
		}
		if (NetType === 'local3') {
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
		if (NetType === 'final') {
			const Winner = localStorage.getItem('FirstWinner')
			if (Winner !== '')
				final_1!.innerHTML = Winner!
			const Winner2 = localStorage.getItem('SecondWinner')
			if (Winner2 !== '')
				final_2!.innerHTML = Winner2!
			const Final = localStorage.getItem('winner')
			if (Final !== '')
				CupWinner!.innerHTML = Final!
			localStorage.removeItem('FirstWinner')
			localStorage.removeItem('SecondWinner')
		}
	}, [])

// 	online Tournament
/* --------------------------------------------------- */
	const [Player1, setName] = useState<string>('p1')
	const [Player2, setName1] = useState<string>('p2')

	useEffect(()=> {
		let index = 0
		var objSocket: any = null
		const final_1 = document.querySelector('.final_1')
		const final_2 = document.querySelector('.final_2')

		const players = document.querySelectorAll('.call')

		if (NetType === 'local' || NetType === 'local2' || NetType === 'local3' || NetType === 'final') return

		function isWebSocketConnected(): boolean {
			return objSocket && objSocket.readyState === WebSocket.OPEN;
		}

		function modifyDisplay(data: any) {
			players[0].innerHTML = data.message.array.name_1.name
			players[1].innerHTML = data.message.array.name_2.name
			players[2].innerHTML = data.message.array.name_3.name
			players[3].innerHTML = data.message.array.name_4.name
		}
	
		objSocket = new WebSocket('ws://e3r11p10:8000/ws/game/tn/')

		if (NetType === 'fill') {
			const JsonData = localStorage.getItem('dataTn')
			const data = JSON.parse(JsonData!)

			players[0].innerHTML = data.player1
			players[1].innerHTML = data.player2
			players[2].innerHTML = data.player3
			players[3].innerHTML = data.player4

			const Winner = localStorage.getItem(Player1 + ' ' + Player2)

			const Winner2 = localStorage.getItem(Player1 + ' ' + Player2)
			
			if (Winner != undefined)
				final_1!.innerHTML = Winner
			else
				final_1!.innerHTML = '...'
			if (Winner2 != undefined)
				final_2!.innerHTML = Winner2
			else
				final_2!.innerHTML = '...'

		}

		function StoreInStorage(data: any) {
			const Content = {
				'player1': data.message.array.name_1.name,
				'player2': data.message.array.name_2.name,
				'player3': data.message.array.name_3.name,
				'player4': data.message.array.name_4.name,
			}
			localStorage.setItem('dataTn', JSON.stringify(Content))
		}

		objSocket.onmessage = function(e: any) {
			const data = JSON.parse(e.data)
			const dataType = data.type

			console.log(data)
			if (dataType === 'identify') {
				index = data.player
				objSocket.send(JSON.stringify({
					'type': 'Player',
					'name': data.name,
					'index': index,
				}))
			}
			if (data?.message?.type === 'JoinedPlayers') {
				StoreInStorage(data)
				modifyDisplay(data)
			}
			if (data?.message?.type === 'firstGame' && (data?.message?.player1 === index.toString() || data?.message?.player2 === index.toString())) {
				const data = JSON.parse(localStorage.getItem('dataTn')!)
				setName(data.player1)
				setName1(data.player2)
				setTimeout(()=> RunFirstGame(true), 3000)
			}
			if (data?.message?.type === 'SecondGame' && (data?.message?.player1 === index.toString() || data?.message?.player2 === index.toString())) {
				const data = JSON.parse(localStorage.getItem('dataTn')!)
				setName(data.player3)
				setName1(data.player4)
				setTimeout(()=> RunSecGame(true), 5000)
			}
		}
		return(()=> {
			localStorage.removeItem('FirstWinner')
			localStorage.removeItem('SecondWinner')
		})
	}, [])

	// useEffect(()=> {

	// 	// if (Winner2 !== '' || Winner2 !== undefined)
	// 	// 	final_2!.innerHTML = Winner2
	// })

	return (
		<div className='VirParent'>
			{(!run && !secondRun && !Final && !FirstGame && !SecGame) && <_tournament/>}
			{run && <_LocalGame type='local' Name1={player1} Name2={player2}/>}
			{secondRun && <_LocalGame type='local2' Name1={player1} Name2={player2}/>}
			{Final && <_LocalGame type='local3' Name1={player1} Name2={player2}/>}
			{FirstGame && <_title title={player1 + ' vs ' + player2}/> && <_OnlineGame Type='Online' Name={Player1} Name2={Player2}/>}
			{SecGame && <_title title={player1 + ' vs ' + player2}/> && <_OnlineGame Type='Online2' Name={Player1} Name2={Player2}/>}
		</div>
	)
}

export default tournament;