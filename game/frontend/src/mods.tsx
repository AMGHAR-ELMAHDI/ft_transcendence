import { useEffect } from 'react';
import './mods.css'

function mods() {
	useEffect(()=> {

	})
	return (
		<div className="_mods">
			<img className='Imods' id='0' src='/first.svg'></img>
			<img className='Imods' id='1' src='/sec.svg'></img>
			<img className='Imods' id='2' src='/third.svg'></img>
			<img className='Imods' id='3' src='/forth.svg'></img>
		</div>
	);
}

export default mods;