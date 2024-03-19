import React from 'react'

function SideBar() {
  return (
    <div id="sideBar">
        <img id="logo" src="sidebarImgs/logo.svg" alt="logo" />
        <div className="pages">
            <img className="sideB" src="sidebarImgs/home.svg" alt="home"/>
            <img className="sideB" src="sidebarImgs/chat.svg" alt="chat"/>
            <img className="sideB" src="sidebarImgs/game.svg" alt="game"/>
            <img className="sideB" src="sidebarImgs/leaderboard.svg" alt="leaderboard"/>
            <img className="sideB" src="sidebarImgs/shop.svg" alt="shop"/>
            <img className="sideB" src="sidebarImgs/profile.svg" alt="profile"/>
        </div>
        <img className="sideB" id="logout" src="sidebarImgs/logout.svg" alt="logout"/>
    </div>
  )
}

export default SideBar