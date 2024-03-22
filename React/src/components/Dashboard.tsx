import React from "react";
import Profile from "./Profile";
import ProfileHistory from "./ProfileHistory";

function Dashboard() {
  return (
    <div id="Dashboard">
      <div id="Dashboard-Main-GameModeContainer">
        <img className="big" src="/DashboardGameModes/table1.jpg" />
      </div>

      <div id="Dashboard-Secondary-GameModeContainer">
        <img className="extraModes" src="/DashboardGameModes/table1.jpg" />
        <img className="extraModes" src="/DashboardGameModes/table1.jpg" />
        <img className="extraModes" src="/DashboardGameModes/table1.jpg" />
      </div>

      <div id="ProfileHistory">
        <ProfileHistory />
      </div>
    </div>
  );
}

export default Dashboard;
