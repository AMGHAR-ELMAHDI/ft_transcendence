import React from 'react'
import './popUp.css'

interface Props {
    title: string
    image: string
    descr: string
}

export default function PopUp({title, image, descr}: Props) {
  return (
    <div className="contai__">
        <div className="achievementIm">
            <img src={image || '/60sGirl.png'} alt="" />
        </div>
        <div className="infosAch">
            <h1>{title || 'test allah allah'}</h1>
            <h3>{descr || 'this achievement is a$$'}</h3>
        </div>
    </div>
  )
}
