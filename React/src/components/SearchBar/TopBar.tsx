import React from "react";
import { IoNotifications } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function TopBar() {
  return (
    <div id="TopBar">
      <div id="welcome-bar">
        <h1>Good Evening,</h1>
        <h1 id="nickName">DawDaw</h1>
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
        <div className="NotifProfile">
          <IoNotificationsOutline id="notif" />
          <Link to={"/profile"}>
            <img className="NotifProfilePic" src="/bacharG.svg" alt="bachar" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
