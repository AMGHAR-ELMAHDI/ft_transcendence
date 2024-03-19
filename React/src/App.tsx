import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import FriendBar from "./components/FriendBar";
import "./App.css";

function App() {
  return (
	<div className="AppClass">
		<div id="SideBar"><SideBar /></div>
		<div className="main">
			<TopBar />
			<Profile />
			<Dashboard />
		</div>
		<div id="FriendBar"><FriendBar /></div>
	</div>
  );
}

export default App;
