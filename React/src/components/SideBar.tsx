import { Link } from "react-router-dom";
import { PiChatCircleTextLight } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";
import Home from "./SideBar/Home";
import Leaderboard from "./SideBar/Leaderboard";
import Shop from "./SideBar/Shop";
import ProfileSideBar from "./SideBar/ProfileSideBar";
import LogOutSideBar from "./SideBar/LogOutSideBar";
import { FiSettings } from "react-icons/fi";


function SideBar() {
  return (
    <div id="SideBar">
		<Link to={"/"}><img id="logo" src="logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}><Home/></Link>
        <Link to={"/chat"}><PiChatCircleTextLight color="#757889" className={window.location.pathname === "/chat" ? "sidebarImgsBlue" : "sidebarImgs"} /></Link>
        <Link to={"/game"}><IoGameControllerOutline className={window.location.pathname === "/game" ? "sidebarImgsBlue" : "sidebarImgs"} /></Link>
        <Link to={"/leaderboard"}> <div className="LeaderSide"><Leaderboard/></div></Link>
        <Link to={"/shop"}><Shop/></Link>
        <Link to={"/profile"}><ProfileSideBar/></Link>
      </div>
      <div className="SideBottom">
        {/* <Link to={"/settings"}><FiSettings className={window.location.pathname === "/settings" ? "sideImgsBlue" : "sideImg"}/></Link> */}
		    <Link to={"/logout"}><LogOutSideBar/></Link>
      </div>
    </div>
  );
}

export default SideBar;
