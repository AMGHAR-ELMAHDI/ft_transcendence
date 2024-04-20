import { Link } from "react-router-dom";
import { PiChatCircleTextLight } from "react-icons/pi";

import { IoGameControllerOutline } from "react-icons/io5";
import Home from "./SideBar/Home";
import Leaderboard from "./SideBar/Leaderboard";
import Shop from "./SideBar/Shop";
import ProfileSideBar from "./SideBar/ProfileSideBar";



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
        <Link to={"/"}><Home/></Link>
        <Link to={"/chat"}><PiChatCircleTextLight className={window.location.pathname === "/chat" ? "sidebarImgsBlue" : "sidebarImgs"} /></Link>
        <Link to={"/game"}><IoGameControllerOutline className={window.location.pathname === "/game" ? "sidebarImgsBlue" : "sidebarImgs"} /></Link>
        <Link to={"/leaderboard"}><Leaderboard/></Link>
        <Link to={"/shop"}><Shop/></Link>
        <Link to={"/profile"}><ProfileSideBar/></Link>
      </div>
		<Link to={"/logout"}>
			<svg  xmlns="http://www.w3.org/2000/svg" className="ionicon sidebarImgs exit" viewBox="0 0 512 512"><path d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273" fill="none" stroke={window.location.pathname === "/logout" ? strokeSpecial : strokeDefault} stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
		</Link>
    </div>
  );
}

export default SideBar;
