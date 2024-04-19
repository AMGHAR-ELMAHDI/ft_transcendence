import { Link } from "react-router-dom";
import { PiChatCircleTextLight } from "react-icons/pi";

import { IoGameControllerOutline } from "react-icons/io5";
import Home from "./SideBar/Home";



function SideBar() {
	let strokeDefault = "#FFFFFF";
	let strokeSpecial = "#1D90F5";
	// if (window.location.pathname === "/profile")
    // window.location.pathname === "/profile" ? strokeSpecial : strokeDefault
  let path = "sidebarImgs/leaderboard.svg";
  if(window.location.pathname === "/leaderboard")
    path = "sidebarImgs/leaderboardBlue.svg";
  
  let path2 = "sidebarImgs/profile.svg";
  return (
    <div id="SideBar">
		<Link to={"/"}><img id="logo" src="sidebarImgs/logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}><div className="sidebarImgs"><Home/></div></Link>
        <Link to={"/chat"}><PiChatCircleTextLight className="sidebarImgsBlue" /></Link>
        <Link to={"/game"}><IoGameControllerOutline className="sidebarImgsBlue" /></Link>
        <Link to={"/leaderboard"}><img className="sidebarImgsBlue" src={path} alt="leaderboard" /></Link>
        <Link to={"/shop"}><img className="sidebarImgsBlue" src="sidebarImgs/shop.svg" alt="shop" /></Link>
        <Link to={"/profile"}><img className="sidebarImgsBlue" src="sidebarImgs/profile.svg" alt="profile" /></Link>
      </div>
		<Link to={"/logout"}>
			<svg  xmlns="http://www.w3.org/2000/svg" className="ionicon sidebarImgs exit" viewBox="0 0 512 512"><path d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273" fill="none" stroke={window.location.pathname === "/logout" ? strokeSpecial : strokeDefault} stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
		</Link>
    </div>
  );
}

export default SideBar;
