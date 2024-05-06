import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardContainer from "./components/Cheesy/DashboardContainer";
import ProfileContainer from "./components/Cheesy/ProfileContainer";
import ChatContainer from "./components/Cheesy/ChatContainer";
import GameContainer from "./components/Cheesy/GameContainer";
import LeaderBoardContainer from "./components/Cheesy/LeaderBoardContainer";
import NotFound from "./components/Cheesy/NotFound";
import Settings from "./components/Cheesy/Settings";
import ShopContainer from "./components/Otchekai/ShopContainer";

import "./App.css";
import "./css/CheesyCss/FriendBar.css";
import "./css/CheesyCss/TopBar.css";
import "./css/CheesyCss/Profile.css";
import "./css/CheesyCss/Dashboard.css";
import "./css/CheesyCss/ProfileMain.css";
import "./css/CheesyCss/SideBar.css";
import "./css/CheesyCss/History.css";
import "./css/CheesyCss/LeaderBoard.css";
import "./css/CheesyCss/ProfileHistory.css";
import "./css/CheesyCss/Settings.css";
import "./css/CheesyCss/NotFound.css";
import "./css/CheesyCss/Logout.css";
import "./css/Otchekai/Shop.css";

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
      <Route path="/settings" element={Settings()} />
      <Route path="*" element={NotFound()} />
    </Routes>
  );
}

export default App;
