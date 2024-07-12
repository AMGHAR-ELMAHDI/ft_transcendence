import { useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { PiChatsCircleBold } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaRankingStar } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import LogOutSideBar from "../SideBar/LogOutSideBar";
import LogoutPopUp from "../SideBar/Logout";
import { useState } from "react";
import { useRecoilState } from "recoil";
import AcessToken from "../../Atoms/AccessToken";

function DrawerLinks() {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [tokenValue, setTokenValue] = useRecoilState(AcessToken);

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    setTokenValue("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="DrawerLinks">
      <div onClick={() => navigate("/")}>
        <IoHome />
        <h1 className="DrawerText">Home</h1>
      </div>
      <div onClick={() => navigate("/chat")}>
        <PiChatsCircleBold />
        <h1 className="DrawerText">Chat</h1>
      </div>
      <div onClick={() => navigate("/game")}>
        <IoGameControllerOutline />
        <h1 className="DrawerText">Game</h1>
      </div>
      <div onClick={() => navigate("/leaderboard")}>
        <FaRankingStar />
        <h1 className="DrawerText">Leaderboard</h1>
      </div>
      <div onClick={() => navigate("/shop")}>
        <CiShop />
        <h1 className="DrawerText">Shop</h1>
      </div>
      <div onClick={() => navigate("/profile")}>
        <FaRegUserCircle />
        <h1 className="DrawerText">Profile</h1>
      </div>
      <div onClick={handleConfirmLogout}>
        <LogOutSideBar />
        <h1 className="DrawerText">Logout</h1>
      </div>
    </div>
  );
}

export default DrawerLinks;
