import React from "react";

function TopBar() {
  return (
    <div id="top-bar">
      <div id="welcome-top-left-bar">
        <h1>Good Evening,</h1>
        <h1 id="nickName">DawDaw</h1>
      </div>

      <div id="search-top-right-bar">
        <input id="search" type="text" placeholder="         Search" />
        <img id="notif" src="/notif.svg" alt="notif" />
      </div>
    </div>
  );
}

export default TopBar;
