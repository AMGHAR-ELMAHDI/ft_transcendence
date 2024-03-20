import React from 'react'

function SideBar() {
  return (
    <>
      <img id="logo" src="sidebarImgs/logo.svg" alt="logo" />
      <div className="sidebar-links">
          <img src="sidebarImgs/home.svg" alt="home"/>
          <img src="sidebarImgs/chat.svg" alt="chat"/>
          <img src="sidebarImgs/game.svg" alt="game"/>
          <img src="sidebarImgs/leaderboard.svg" alt="leaderboard"/>
          <img src="sidebarImgs/shop.svg" alt="shop"/>
          <img src="sidebarImgs/profile.svg" alt="profile"/>
      </div>
      <img id="logout" src="sidebarImgs/logout.svg" alt="logout"/>
    </>
  )
}

export default SideBar