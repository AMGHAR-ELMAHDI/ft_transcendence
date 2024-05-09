import { useEffect } from 'react'
import './inQueue.css'

function SearchingLoading() {

	useEffect(()=> {
		var lol = false
		var RealText: string = 'Searching'
		var alphabets = 'abcdefghijklmnopqrStuvwxyz'
		var text = document.querySelector('.containent h1')

		for (let index = 0; index < RealText.length;) {
			for (let Jindex = 0; Jindex < alphabets.length; Jindex++) {
				text!.innerHTML += alphabets[Jindex]
				if (alphabets[Jindex] === RealText[index]) {
					index++;
					break
				}
				else
					text!.innerHTML = text!.innerHTML.substring(0, text!.innerHTML.length - 1)
			}
		}
	}, [])

	return (
		<div className='containent'>
			<h1></h1>
		</div>
	)
}

export default SearchingLoading