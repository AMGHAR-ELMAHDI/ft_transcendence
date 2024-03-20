import React from "react";

function TopBar() {
  return (
    <>
      <div id="wc-bar">
        <h1>Good Evening,</h1>
        <h1 id="nickName">DawDaw</h1>
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="         Search" />
        <img id="notif" src="/notif.svg" alt="notif" />
      </div>
    </>
  );
}

export default TopBar;
