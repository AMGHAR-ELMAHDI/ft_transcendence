import Home from "../SideBar/Home";
import Leaderboard from "../SideBar/Leaderboard";
import Shop from "../SideBar/Shop";
import ProfileSideBar from "../SideBar/ProfileSideBar";
import LogOutSideBar from "../SideBar/LogOutSideBar";
import LogoutPopUp from "../SideBar/Logout";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiChatCircleTextLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Link} from "react-router-dom";



function SideBar() {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleConfirmLogout = () => {
      setShowLogoutPopup(false);
    };

    const handleCancelLogout = () => {
      setShowLogoutPopup(false);
    };

    
  return (
    <div id="SideBar">
      <Link to={"/"}><img id="logo" src="logo.svg" alt="logo" /></Link>
      <div className="sidebar-links">
        <Link to={"/"}> <Home /></Link>
        <Link to={"/chat"}> <PiChatCircleTextLight color="#757889" className={ window.location.pathname === "/chat" ? "sidebarImgsBlue" : "sidebarImgs" }/></Link>
        <Link to={"/game"}> <IoGameControllerOutline className={ window.location.pathname === "/game" ? "sidebarImgsBlue" : "sidebarImgs"}/></Link>
        <Link to={"/leaderboard"}><div className="LeaderSide"><Leaderboard /></div></Link>
        <Link to={"/shop"}><Shop /></Link>
        <Link to={"/profile"}><ProfileSideBar /></Link>
      </div>
      <div className="SideBottom" onClick={() => (setShowLogoutPopup(!showLogoutPopup))}>
        <LogOutSideBar />
        {showLogoutPopup && <LogoutPopUp onConfirm={handleConfirmLogout} onCancel={handleCancelLogout}/>}
      </div>
    </div>
  );
}

export default SideBar;