import { useEffect, useRef } from 'react';
import './mods.css'

function mods() {
	const notificationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
	  const handleClickOutside = (event: MouseEvent) => {
		if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
		  const mods = document?.querySelector('.mod_Cont')
		  mods?.classList.remove('showMods_')
		}
	  };
  
	  document.addEventListener("mousedown", handleClickOutside);
  
	  return () => {
		document.removeEventListener("mousedown", handleClickOutside);
	  };
	}, [notificationRef]);
	return (
		<div ref={notificationRef} className="mod_Cont">
			<div className="_mods">
				<img className='Imods' id='0' src='/first.svg'></img>
				<img className='Imods' id='1' src='/sec.svg'></img>
				<img className='Imods' id='2' src='/third.svg'></img>
				<img className='Imods' id='3' src='/forth.svg'></img>
			</div>
		</div>
	);
}

export default mods;