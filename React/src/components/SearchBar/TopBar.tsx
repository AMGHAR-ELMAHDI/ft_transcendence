import { IoNotificationsOutline } from "react-icons/io5";
import React, { useEffect } from "react";
import axios from "axios";
import { setAuthToken } from "../Utils/setAuthToken";
import { Link } from "react-router-dom";

export function getPageName() {
  let pageName = window.location.pathname;
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

const DropdownMenu = () => {
  return (
    <div className="dropdown-menu">
      <ul>
        <li>
          <Link to={"/profile"}> Profile</Link>
        </li>
        <li>
          <Link to={"/settings"}> Settings</Link>
        </li>
      </ul>
    </div>
  );
};

function TopBar() {
  const [data, setData] = React.useState<any>({});
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/me");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const obj = {
    username: data.username,
    avatar: "http://localhost:2500" + data.avatar?.substring(6),
    friends: data.friends ? data.friends : [0],
    level: data.level,
  };

  useEffect(() => {
    getData();
  }, []);

  let print = <h1>Good Evening,</h1>;
  let username = <h1 id="nickName">{obj.username}</h1>;
  return (
    <div id="TopBar">
      <div id="welcome-bar">
        {window.location.pathname === "/" && print}
        {window.location.pathname === "/" && username}
        {window.location.pathname !== "/" && (
          <h1 id="nickName">{getPageName()}</h1>
        )}
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
        <div className="NotifProfile">
          <IoNotificationsOutline id="notif" />
          <div
            className="div-relat"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img className="NotifProfilePic" src={obj.avatar} />
            {isDropdownVisible && <DropdownMenu />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
