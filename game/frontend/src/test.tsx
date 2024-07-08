import axios from "axios"
import { useEffect, useState } from "react"
import './test.css'

function userGame() {

    const [counter, setCounter] = useState<number>(0)
    const [percentage, setPercentage] = useState<string>('')
    const [level, setLevel] = useState<number>(0)

    useEffect(()=> {
        function handleClick(count: number) {
            axios.get(`http://localhost:8000/game/save-game/?counter=${count}`)
            .then(response => {
                console.log(response.data)
                setLevel(response.data.level)
                const progress = (response.data.progress / (response.data.level * 1000)) * 100
                setPercentage(progress + '%')
                console.log(response.data.progress , ' ', response.data.level * 1000)
            })
            .catch(error => {
                console.log(error)
            })
        }

        const btn = document.querySelector('.had')
        let count = 0
        const exit = setInterval(()=> {
            count++
            setCounter(count)
            btn?.addEventListener('click',()=> {
                clearInterval(exit)
                handleClick(count)
            })
        }, 1000)
    }, [])

    return (
        <div className="btn-stop">
            <h1>{counter}</h1>
            <div className="level">
                <div className="inside" style={{width: `${percentage}`}}></div>
                <h2 className="le">{level}</h2>
            </div>
            <button className="had">stop</button>
        </div>
    )
}

export default userGame