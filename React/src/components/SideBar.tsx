import React from "react";
import { Link } from "react-router-dom";



function SideBar() {
	let strokeDefault = "#FFFFFF";
	let strokeSpecial = "#1D90F5";
	// if (window.location.pathname === "/profile")
    // window.location.pathname === "/profile" ? strokeSpecial : strokeDefault
	
  return (
    <div id="SideBar">
		<Link to={"/"}><img id="logo" src="sidebarImgs/logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}>
			<img src="sidebarImgs/home.svg" alt="home" />
		</Link>
        <Link to={"/chat"}><img src="sidebarImgs/chat.svg" alt="chat" /></Link>
        <Link to={"/game"}>
			<svg xmlns="http://www.w3.org/2000/svg" className="ionicon sidebarImgs" viewBox="0 0 512 512"><path d="M467.51 248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5 91.5 0 00352 96c-26.89 0-48.11 16-96 16s-69.15-16-96-16a99.09 99.09 0 00-27.2 3.66C89 112.59 61.94 165.7 43.33 248.83c-19 84.91-15.56 152 21.58 164.88 26 9 49.25-9.61 71.27-37 25-31.2 55.79-40.8 119.82-40.8s93.62 9.6 118.66 40.8c22 27.41 46.11 45.79 71.42 37.16 41.02-14.01 40.44-79.13 21.43-165.04z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/><circle cx="292" cy="224" r="20"/><path d="M336 288a20 20 0 1120-19.95A20 20 0 01336 288z"/><circle cx="336" cy="180" r="20"/><circle cx="380" cy="224" r="20"/><path fill="red" stroke={window.location.pathname === "/game" ? strokeSpecial : strokeDefault} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M160 176v96M208 224h-96"/></svg>
		</Link>
        <Link to={"/leaderboard"}><img src="sidebarImgs/leaderboard.svg" alt="leaderboard" /></Link>
        <Link to={"/shop"}><img src="sidebarImgs/shop.svg" alt="shop" /></Link>
        <Link to={"/profile"}><img src="sidebarImgs/profile.svg" alt="profile" /></Link>
      </div>
		<Link to={"/logout"}>
			<svg xmlns="http://www.w3.org/2000/svg" className="ionicon sidebarImgs" viewBox="0 0 512 512"><path d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273" fill="none" stroke={window.location.pathname === "/logout" ? strokeSpecial : strokeDefault} stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
		</Link>
    </div>
  );
}

export default SideBar;
