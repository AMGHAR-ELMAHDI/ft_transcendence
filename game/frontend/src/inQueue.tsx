import { useEffect } from 'react'
import './inQueue.css'

function SearchingLoading() {

	useEffect(()=> {
		var lol = false
		var RealText: string = 'Searching'
		var alphabets = 'abcdefghijklmnopqrStuvwxyz'
		var text = document.querySelector('.containent h1')

		window.addEventListener('load', ()=> {
			var interval = 0
			const exit = setInterval(()=> {
				text!.innerHTML = text?.innerHTML.split("")
				.map(letter=> alphabets[Math.floor(Math.random() * 26)])
				.join("")!
				if (interval == 9) clearInterval(exit)
				interval += 1
			}, 30)
		})
	// }, [])

	return (
		<div className='containent'>
			<h1></h1>
		</div>
	)
}

export default SearchingLoading