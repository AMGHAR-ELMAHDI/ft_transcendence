import _idx from './idx';
import _loginEl from './loginEl';
import _register from './register';
import _dash from './dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';

//PascalCasing
function App() {
  const [status_code, getStatus] = useState<number>(0)

	const [error, setError] = useState('')
	useEffect(() => {
		var query = location.search
		var error = query?.split('?')
		let stats = error[1]?.split('&')
		for (let i = 0; i < stats?.length; i++)
			if (stats[i]?.startsWith('status=')) {
        setError(stats[i]?.replace('status=', '')?.replace(/_/g, ' '))
			}
	})

  useEffect(()=> {
    // saving the client with 42 auth
    axios.defaults.withCredentials = true;
    axios?.get('http://localhost:8000/check/', {
      withCredentials: true,
    })
    .then(response => {
      if (response?.status == 200)
        getStatus(response?.status)
      else
        getStatus(response.status)
    })
    .catch(error => {
      console.log('error', error)
    })

    const login = document.querySelector('.create') as HTMLElement;
    // saving the client without 42 auth
    login?.addEventListener('click', () => {
      axios?.get('http://localhost:8000/AutoSave/', {
        withCredentials: true,
      })
      .then(response => {
        if (response?.status == 200)
          getStatus(response?.status)
        else
          getStatus(response.status)
      })
      .catch(error => {
        console.log('error', error)
      })
    })
  }, [])

  return (
    <>
      {
        error === 'incorrect password' || error === 'email not found' || error === 'already exist' || error === 'user loggedIn as 42'
        ?<div><_idx></_idx><_loginEl /></div>:
        status_code === 200 || error === 'loggedin' || error === 'done'
        ?<div><_idx></_idx><_dash /></div>:
        status_code != 200
        ?<div><_idx></_idx><_register /></div>:''
      }
    </>
  );
}

export default App;