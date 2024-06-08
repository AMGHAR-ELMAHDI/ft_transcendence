import { useEffect, useState } from 'react'
import './LocTn.css'
import _tournament from './tournament'

function LocalTn() {

	const [text, setText] = useState<boolean>(false)

	const handleClick = () => {
		setText(true)
	}

	useEffect(()=> {
		var validate: boolean = true 
		const register = document.getElementById('btn-reg')
		const inputs = document.querySelectorAll('div input')
		const name_1 = document.querySelector('.inpone')
		const name_2 = document.querySelector('.inptwo')
		const name_3 = document.querySelector('.inptree')
		const name_4 = document.querySelector('.inpfour')
		register?.addEventListener('click', ()=> {
			inputs.forEach(input => {
				if ((input as HTMLInputElement).value == "") {
					input?.classList.add('empty')
					setTimeout(()=> input?.classList.remove('empty'), 1000)
					validate = false
					return
				}
			});
			validate = true
			if (validate) {
				const data = {
					'name_1': (name_1 as HTMLInputElement)!.value,
					'name_2': (name_2 as HTMLInputElement)!.value,
					'name_3': (name_3 as HTMLInputElement)!.value,
					'name_4': (name_4 as HTMLInputElement)!.value
				}
				localStorage.setItem('dataTn', JSON.stringify(data))
			}
		})
	}, [])
	return (
		<div className='VirParent'>
			{!text && 
			<div className="cmon">
				<div className="ci">
					<div className="log">
						<img src='Frame.svg'></img>
					</div>
					<div className='inputs-h'>
						<div className='1st-inp'>
							<label>1st name</label>
							<input className='inpone' placeholder=''></input>
						</div>
						<div className='2nd-inp'>
							<label>2nd name</label>
							<input className='inptwo' placeholder=''></input>
						</div>
						<div className='3rd-inp'>
							<label>3rd name</label>
							<input className='inptree' placeholder=''></input>
						</div>
						<div className='4th-inp'>
							<label>4th name</label>
							<input className='inpfour' placeholder=''></input>
						</div>
						<div>
							<button onClick={handleClick} id='btn-reg'>
								<p>register</p>
							</button>
						</div>
					</div>
				</div>
			</div>}
			{text && < _tournament NetType='local'/>}
		</div>
	)
}

export default LocalTn