import axios from 'axios';
import './idx.css'
import { useEffect, useState } from 'react';

function dashboard() {
	const [Name, GetName] = useState('')
	const [sec, GetSec] = useState('')
	useEffect(()=> {
	  axios.defaults.withCredentials = true;
	  axios?.get('http://localhost:8000/check/', {
		withCredentials: true,
	  })
	  .then(response => {
		if (response?.status == 200) {
			GetName(response.data.data.firstname)
			GetSec(response.data.data.lastname)
		}
	  })
	  .catch(error => {
		console.log('error', error)
	  })
	}, [])
	return (
		<div className="container">
			<div style={{color: 'white', fontFamily: 'lightpant', gap: '10px', fontSize: '10px', position: 'absolute', top: '50px', right: '50px'}} className="fullname">
				<h1>{sec}</h1>
				<h1>{Name}</h1>
			</div>
		</div>
	);
}

export default dashboard;