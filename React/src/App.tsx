import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardContainer from "./components/DashboardContainer";
import ProfileContainer from "./components/ProfileContainer";
import ChatContainer from "./components/ChatContainer";
import GameContainer from "./components/GameContainer";
import LeaderBoardContainer from "./components/LeaderBoardContainer";
import ShopContainer from "./components/ShopContainer";
import NotFound from "./components/NotFound";
import LogoutContainer from "./components/LogoutContainer";

import "./App.css";
import "./css/FriendBar.css";
import "./css/TopBar.css";
import "./css/Profile.css";
import "./css/Dashboard.css";
import "./css/ProfileMain.css";
import "./css/SideBar.css";
import "./css/History.css";
import "./css/LeaderBoard.css";

function App() {
  const [render, setRender] = useState<string>("History");

  return (
    <Routes>
      <Route path="/" element={DashboardContainer(render, setRender)} />
      <Route path="/chat" element={ChatContainer()} />
      <Route path="/game" element={GameContainer()} />
      <Route path="/login" element={DashboardContainer(render, setRender)} />
      <Route path="/leaderboard" element={LeaderBoardContainer()} />
      <Route path="/shop" element={ShopContainer()} />
      <Route path="/profile" element={ProfileContainer(render, setRender)} />
      <Route path="/logout" element={LogoutContainer()} />
      <Route path="*" element={NotFound()} />
    </Routes>
  );
}

export default App;
