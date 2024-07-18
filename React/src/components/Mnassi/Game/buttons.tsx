import { useEffect } from 'react';
import './buttons.css'

function buttons() {
	useEffect(()=> {
		const keyUp = document.getElementById('up')
		const keydown = document.getElementById('down')
		const arrowUp = document.getElementById('fog')
		const arrowDown = document.getElementById('ta7t')

		window.addEventListener('keyup', function(e) {
			if (e.key === 'w')
				keyUp?.classList.remove('clicked')
			if (e.key === 's')
				keydown?.classList.remove('clicked')
		})
		window.addEventListener('keydown', function(e) {
			if (e.key === 'w')
				keyUp?.classList.add('clicked')
			if (e.key === 's')
				keydown?.classList.add('clicked')
		})
		window.addEventListener('keyup', function(e) {
			if (e.key === 'ArrowUp')
				arrowUp?.classList.remove('clicked')
			if (e.key === 'ArrowDown')
				arrowDown?.classList.remove('clicked')
		})
		window.addEventListener('keydown', function(e) {
			if (e.key === 'ArrowUp')
				arrowUp?.classList.add('clicked')
			if (e.key === 'ArrowDown')
				arrowDown?.classList.add('clicked')
		})
	})
	return (
		<div className="container_">
			<div className="key_1">
				<div id='up'></div>
				<div id='down'></div>
			</div>
			<div className="key_2">
				<div id='fog'></div>
				<div id='ta7t'></div>
			</div>
		</div>
	)
}

export default buttons;