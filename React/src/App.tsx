import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import FriendBar from "./components/FriendBar";
import "./App.css";
import "./css/SideBar.css";
import "./css/FriendBar.css";
import "./css/TopBar.css";
import "./css/Profile.css";
import "./css/Dashboard.css";

function App() {
  return (
	<div className="AppClass">
		<div id="SideBar"><SideBar /></div>
		<div className="main">
			<div id="TopBar"><TopBar /></div>
			<div id="DashboardProfileContainer">
				<div id="Profile"><Profile /></div>
				<div id="Dashboard"><Dashboard /></div>
			</div>
		</div>
		<div id="FriendBar"><FriendBar /></div>
	</div>
  );
}

export default App;
