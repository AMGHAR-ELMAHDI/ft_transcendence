import _game2D from './interface';
import _UserViews from './view';
import _Main from './mainComponent';
import _multiplayer2 from './multiplayer2';
import _multiplayer from './multiplayer';
import _tournament from './tournament';
import _buttons from './buttons';
import _Animation from './animation';
import _LocTn from './LocTn';
import _mods from './mods';
import _title from './title';
import _Queue from './inQueue';
import _test from './test';
import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';

function Options() {
  const [type, setMod] = useState<string>('')

  useEffect(()=> {
    const btn = document?.getElementById('mods')
    const mods = document?.querySelectorAll('.Imods')
    btn?.addEventListener('click', ()=> {
      setMod('')
    })
    mods.forEach(mod => {
      mod?.addEventListener('click', ()=> {
        setMod(mod.id)
      })
    });
  })
    return (
        // type === "0" ?
        // <div><_Main />< _title title='local game'/><_multiplayer2 type='' Name1='PLAYER1' Name2='PLAYER2' /></div>:
        // type === "1" ?
        // <div><_Main />< _title title='local vs bot'/><_game2D /></div>:
        // type === "2" ?
        <div><_Main/><_tournament NetType=''/></div>
        // type === '3' ?
        // <div><_Main/><_multiplayer Type='' Name='' Name2=''/></div>
        // <div><_Main/>< _title title='Local Tournament'/>< _LocTn/></div>:
        // <div><_Main />< _title title='Overview'/><_UserViews /><_mods /></div>
        // <div><_Main/><_Animation /></div>
    )
}

function App() {
  const [User, GuestOrUser] = useState<boolean>(false)

  // useEffect(()=> {
  //     axios.defaults.withCredentials = true;
  //     axios?.get('http://localhost:8000/check/', {
  //       withCredentials: true,
  //     })
  //     .then(response => {
  //       if (response?.status === 200)
  //         GuestOrUser(true)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }, [])

  return (
    <Options/>
  );
}

export default App;