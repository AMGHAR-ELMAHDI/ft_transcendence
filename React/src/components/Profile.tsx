import React from "react";

interface ProfileProps {
  profileList: string;
}

const divStyleDashboard = {
  justifyContent: "center",
};

const divStyleProfile = {
  justifyContent: "space-between",
};

function Profile({ profileList }: ProfileProps) {
  const profileLevelStyle =
    profileList === "RenderList" ? divStyleProfile : divStyleDashboard;
  const boolRender = profileList === "RenderList" ? true : false;
  return (
    <div id="Profile">
      <div className="profile-left">
        <div id="profile-usr">
          <img id="profile-img" src="/bacharG.svg" alt="profilePic" />
          <h1 id="user-name">Othman Chekairi</h1>
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
              <h2>Level 10</h2>
              <h2>700/1000</h2>
            </div>
            <div id="profile-level-bar">
              <progress id="progress-bar" value={75} max={100} />
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
          <svg id="progress-thingy"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="-rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              strokeWidth={4}
              r="48"
              fill="transparent"
              stroke="#7f7f7f3f"
            />
            <circle
              cx="50"
              cy="50"
              strokeWidth={4}
              r="48"
              fill="transparent"
              stroke="#5FCAE4"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={-20 - 100}
            />
          </svg>
          {/* <div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div> */}
          {/* <div className="progress-circle" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
