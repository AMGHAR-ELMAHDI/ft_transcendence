import { useEffect } from 'react'
import './inQueue.css'

interface TextType {
	TheTitle: string
}

function SearchingLoading({TheTitle}: TextType) {

	useEffect(()=> {
		var RealText: string = TheTitle
		var text = document.getElementById('text')
		let i = 0

		const exit = setInterval(()=> {
			if (i == RealText.length - 1)
				clearInterval(exit)
			text!.innerHTML += RealText[i]
			i++
		}, 200)
	}, [])

	return (
		<div className='containent'>
			<h1 id='text'></h1>
		</div>
	)
}

export default SearchingLoading