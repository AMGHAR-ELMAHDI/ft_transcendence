import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import FriendBar from "./components/FriendBar";
import ProfileMain from "./components/ProfileMain";
import Test from "./components/Test";
import "./App.css";
import "./css/SideBar.css";
import "./css/FriendBar.css";
import "./css/TopBar.css";
import "./css/Profile.css";
import "./css/Dashboard.css";
import "./css/ProfileMain.css";

function App() {
  return (
    <div className="AppClass">
      <SideBar />
      <div className="main">
        <TopBar />
        <div id="DashboardProfileContainer">
          <Profile profileList="RenderList" />
          {/* <ProfileMain render="Trophies" /> */}
          {/* <Dashboard /> */}
          <Test />
        </div>
      </div>
      <FriendBar />
    </div>
  );
}

export default App;
