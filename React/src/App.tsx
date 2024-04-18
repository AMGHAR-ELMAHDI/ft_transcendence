import { useState } from "react";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import FriendBar from "./components/FriendBar";
import ProfileMain from "./components/ProfileMain";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

import "./App.css";
import "./css/SideBar.css";
import "./css/FriendBar.css";
import "./css/TopBar.css";
import "./css/Profile.css";
import "./css/Dashboard.css";
import "./css/ProfileMain.css";

function App() {
  const [render, setRender] = useState<string>("History");

  return (
    <div className="AppClass">
      <SideBar />
      <div className="main">
        <TopBar />
          <Routes>
			<Route path="/profile" element={<><Profile profileList="RenderList" show={render} setRender={setRender} /> <ProfileMain inRender={render} /></>}/>
			<Route path="/" element={<><Profile profileList="Dont" show={render} setRender={setRender} /> <Dashboard /></>} />
          </Routes>
      </div>
      <FriendBar />
    </div>
  );
}

export default App;
