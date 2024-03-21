import React from "react";
import { IoNotifications } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";


function TopBar() {
  return (
    <>
      <div id="welcome-bar">
        <h1>Good Evening,</h1>
        <h1 id="nickName">DawDaw</h1>
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
		<IoNotificationsOutline id="notif" />
      </div>
    </>
  );
}

export default TopBar;
