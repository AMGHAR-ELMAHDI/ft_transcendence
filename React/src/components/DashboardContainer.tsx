import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Profile from "./Profile";
import FriendBar from "./FriendBar";
import Dashboard from "./Dashboard";

function DashboardContainer(render: string, setRender: any) {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Profile profileList="Dont" show={render} setRender={setRender} />
          <Dashboard />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default DashboardContainer;
