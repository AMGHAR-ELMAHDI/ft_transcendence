import { useEffect, useState } from 'react';
import axios from 'axios';

function LeaderBoard() {
	const [allLi, setAllLi] = useState([])
	useEffect(() => {
		const parent = document.querySelector('.par')
		var lists = document.querySelectorAll('.list')
		let i = 0
		axios.get('http://localhost:8000/get/')
			.then((response) => {
				const data = JSON.parse(response.data)
				setAllLi(data)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])
	return (
		<div className="cont_">
			<ul className='par'>
				{
					allLi.map(e =>
						<div>
							<li className='list'>{e?.fields.username + ' ' + e?.fields.level}</li>
						</div>
					)
				}

			</ul>
		</div>
	)
}

export default LeaderBoard;