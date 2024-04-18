import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardContainer from "./components/DashboardContainer";
import ProfileContainer from "./components/ProfileContainer";
import ChatContainer from "./components/ChatContainer";
import GameContainer from "./components/GameContainer";
import LeaderBoardContainer from "./components/LeaderBoardContainer";
import ShopContainer from "./components/ShopContainer";

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
    <Routes>
      <Route path="/" element={DashboardContainer(render, setRender)}></Route>
      <Route path="/chat" element={ChatContainer()}></Route>
      <Route path="/game" element={GameContainer()}></Route>
      <Route path="/leaderboard" element={LeaderBoardContainer()}></Route>
      <Route path="/shop" element={ShopContainer()}></Route>
      <Route path="/profile" element={ProfileContainer(render, setRender)}></Route>
    </Routes>
  );
}

export default App;
