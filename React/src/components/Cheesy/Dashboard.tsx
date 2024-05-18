import React, { useEffect } from "react";
import ProfileHistory from "./ProfileHistory";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";

function Dashboard() {
  return (
    <div id="Dashboard">
      <div id="Dashboard-Main-GameModeContainer"></div>

      <div id="Dashboard-Secondary-GameModeContainer">
        <div id="Dashboard-Secondary-tournament"></div>
        <div id="Dashboard-Secondary-bot"></div>
        <div id="Dashboard-Secondary-practice"></div>
      </div>

      <div id="DashboardHistory">
        <ProfileHistory />
      </div>
    </div>
  );
}

export default Dashboard;
