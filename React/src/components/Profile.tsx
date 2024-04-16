import React from "react";
import { useState } from "react";
import Circle from "./Circle.tsx";
import ProfileData from "../Data/Profile.json";

interface ProfileProps {
  profileList: string;
}

const divStyleDashboard = { justifyContent: "center" };

const divStyleProfile = { justifyContent: "space-between" };

function getLevelStart() {
  let levelStartIndex = ProfileData.level.toString().lastIndexOf(".") + 1;
  let levelStart = "";
  if (levelStartIndex != 0)
    levelStart = ProfileData.level.toString().slice(levelStartIndex);
  else levelStart = "0";
  return levelStart;
}

function Profile({ profileList }: ProfileProps) {
  const profileLevelStyle =
    profileList === "RenderList" ? divStyleProfile : divStyleDashboard;
  const boolRender = profileList === "RenderList" ? true : false;

  let levelStart = Number(getLevelStart()) * 100;

  return (
    <div id="Profile">
      <div className="profile-left">
        <div id="profile-usr">
          <img id="profile-img" src="/bacharG.svg" alt="profilePic" />
          <h1 id="user-name">
            {ProfileData.first_name + " " + ProfileData.last_name}
          </h1>
        </div>
        <div className="line1">
          <div className="line2"></div>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-level" style={profileLevelStyle}>
          {boolRender && <div></div>}
          <div id="profile-level-container">
            <div id="profile-level-text">
              <h2>Level {ProfileData.level}</h2>
              <h2>{levelStart}/1000</h2>
            </div>
            <div id="profile-level-bar">
              <progress id="progress-bar" value={levelStart} max={1000} />
            </div>
          </div>
          {boolRender && (
            <div id="profile-tabs">
              <h1>History</h1>
              <h1>Trophies</h1>
              <h1>Items</h1>
            </div>
          )}
        </div>

        <div id="circles">
          <Circle value={Number(ProfileData.win_rate)} />
          <Circle value={ProfileData.trophies_rate} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
