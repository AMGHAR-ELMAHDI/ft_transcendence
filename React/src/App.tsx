import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardContainer from "./components/Cheesy/DashboardContainer";
import ProfileContainer from "./components/Cheesy/ProfileContainer";
import ChatContainer from "./components/Otchekai/ChatContainer";
import GameContainer from "./components/Cheesy/GameContainer";
import LeaderBoardContainer from "./components/Cheesy/LeaderBoardContainer";
import NotFound from "./components/Cheesy/NotFound";
import Settings from "./components/Cheesy/Settings";
import ShopContainer from "./components/Otchekai/ShopContainer";
import Login from "./components/Cheesy/Login";
import Register from "./components/Cheesy/Register";
import Users from "./components/Cheesy/Users";
import ProfileLayout from "./components/Cheesy/ProfileLayout";

import "./Imports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardContainer />} />
      <Route path="chat" element={ChatContainer()} />
      <Route path="game" element={GameContainer()} />
      <Route path="leaderboard" element={LeaderBoardContainer()} />
      <Route path="shop" element={ShopContainer()} />
      <Route path="profile" element={<ProfileLayout />}>
        <Route index element={<ProfileContainer />} />
        <Route path=":username" element={Users()} />
      </Route>
      <Route path="login" element={Login()} />
      <Route path="register" element={Register()} />
      <Route path="settings" element={Settings()} />
      <Route path="*" element={NotFound()} />
    </Routes>
  );
}

export default App;
