import React from "react";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div id="SideBar">
		<Link to={"/"}><img id="logo" src="sidebarImgs/logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}><img src="sidebarImgs/home.svg" alt="home" /></Link>
        <Link to={"/chat"}><img src="sidebarImgs/chat.svg" alt="chat" /></Link>
        <Link to={"/game"}><img src="sidebarImgs/game.svg" alt="game" /></Link>
        <Link to={"/leaderboard"}><img src="sidebarImgs/leaderboard.svg" alt="leaderboard" /></Link>
        <Link to={"/shop"}><img src="sidebarImgs/shop.svg" alt="shop" /></Link>
        <Link to={"/profile"}><img src="sidebarImgs/profile.svg" alt="profile" /></Link>
      </div>
      <Link to={"/logout"}><img id="logout" src="sidebarImgs/logout.svg" alt="logout" /></Link>
    </div>
  );
}

export default SideBar;
