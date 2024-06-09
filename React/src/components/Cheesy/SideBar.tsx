import Home from "../SideBar/Home";
import Leaderboard from "../SideBar/Leaderboard";
import Shop from "../SideBar/Shop";
import ProfileSideBar from "../SideBar/ProfileSideBar";
import LogOutSideBar from "../SideBar/LogOutSideBar";
import LogoutPopUp from "../SideBar/Logout";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiChatCircleTextLight } from "react-icons/pi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AcessToken from "../../Atoms/AccessToken";
import IsLogged from "../../Atoms/IsLogged";
import { useRecoilState } from "recoil";

import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";

function SideBarLinks() {
  return (
    <div className="sidebar-links">
      <Link to={"/"}>
        <Home />
      </Link>
      <Link to={"/chat"}>
        <PiChatCircleTextLight
          color="#757889"
          className={
            window.location.pathname === "/chat"
              ? "sidebarImgsBlue"
              : "sidebarImgs"
          }
        />
      </Link>
      <Link to={"/game"}>
        <IoGameControllerOutline
          className={
            window.location.pathname === "/game"
              ? "sidebarImgsBlue"
              : "sidebarImgs"
          }
        />
      </Link>
      <Link to={"/leaderboard"}>
        <div className="LeaderSide">
          <Leaderboard />
        </div>
      </Link>
      <Link to={"/shop"}>
        <Shop />
      </Link>
      <Link to={"/profile"}>
        <ProfileSideBar />
      </Link>
    </div>
  );
}

function DrawerLinks() {
  const navigate = useNavigate();

  return (
    <div className="DrawerLinks">
      <h1 onClick={() => navigate("/")}>Home</h1>
      <h1 onClick={() => navigate("/chat")}>Chat</h1>
      <h1 onClick={() => navigate("/game")}>Game</h1>
      <h1 onClick={() => navigate("/leaderboard")}>Leaderboard</h1>
      <h1 onClick={() => navigate("/shop")}>Shop</h1>
      <h1 onClick={() => navigate("/profile")}>Profile</h1>
    </div>
  );
}

function SideBar() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [tokenValue, setTokenValue] = useRecoilState(AcessToken);
  const [Logged, setLogged] = useRecoilState(IsLogged);

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    setTokenValue("");
    localStorage.removeItem("token");
    setLogged(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    // navigate("/");
  };

  return (
    <div id="SideBar">
      <div className="absolute">
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="left"
          className="Drawer"
        >
          <DrawerLinks />
        </Drawer>
      </div>
      <img onClick={toggleDrawer} id="logo" src="/logo.svg" alt="logo" />
      <SideBarLinks />
      <div
        className="SideBottom"
        onClick={() => setShowLogoutPopup(!showLogoutPopup)}
      >
        <LogOutSideBar />
        {showLogoutPopup && (
          <LogoutPopUp
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}
      </div>
    </div>
  );
}

export default SideBar;
