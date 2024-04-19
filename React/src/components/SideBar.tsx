import { Link } from "react-router-dom";
import { PiChatCircleTextLight } from "react-icons/pi";

import { IoGameControllerOutline } from "react-icons/io5";



function SideBar() {
	let strokeDefault = "#FFFFFF";
	let strokeSpecial = "#1D90F5";
	// if (window.location.pathname === "/profile")
    // window.location.pathname === "/profile" ? strokeSpecial : strokeDefault
  let path = "sidebarImgs/leaderboard.svg";
  if(window.location.pathname === "/leaderboard")
    path = "sidebarImgs/leaderboardBlue.svg";
  
  return (
    <div id="SideBar">
		<Link to={"/"}><img id="logo" src="sidebarImgs/logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}><img src="sidebarImgs/home.svg" alt="home" /></Link>
        <Link to={"/chat"}><PiChatCircleTextLight className="sidebarImgs" /></Link>
        <Link to={"/game"}><IoGameControllerOutline className="sidebarImgs" /></Link>
        <Link to={"/leaderboard"}><img className="sidebarImgs" src={path} alt="leaderboard" /></Link>
        <Link to={"/shop"}><img className="sidebarImgs" src="sidebarImgs/shop.svg" alt="shop" /></Link>
        <Link to={"/profile"}><img src="sidebarImgs/profile.svg" alt="profile" /></Link>
      </div>
		<Link to={"/logout"}>
			<svg xmlns="http://www.w3.org/2000/svg" className="ionicon sidebarImgs" viewBox="0 0 512 512"><path d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273" fill="none" stroke={window.location.pathname === "/logout" ? strokeSpecial : strokeDefault} stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
		</Link>
    </div>
  );
}

export default SideBar;
