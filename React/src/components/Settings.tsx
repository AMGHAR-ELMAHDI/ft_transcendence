import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Profile from "./Profile";
import FriendBar from "./FriendBar";
import Dashboard from "./Dashboard";

function Settings() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default Settings;
