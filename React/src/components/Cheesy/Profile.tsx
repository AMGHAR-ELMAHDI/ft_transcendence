import React, { useEffect } from "react";

import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getMeData } from "../Utils/GetMeData";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useRecoilValue } from "recoil";
import AcessToken from "../../Atoms/AccessToken";

const divStyleDashboard = { justifyContent: "center" };

const divStyleProfile = { justifyContent: "space-between" };

function getCircles(person: { win_rate: number; achievements_rate: number }) {
  return (
    <div id="circles">
      <CircularProgressbarWithChildren
        value={person.win_rate}
        styles={buildStyles({
          pathColor: `rgba(95, 202, 228, 1)`,
          textColor: "#FFFFFF",
          trailColor: "#323644",
          backgroundColor: "#3e98c7",
        })}
      >
        <div style={{ fontSize: 30, color: "#B2B2B2", marginTop: -20 }}>
          Win Rate
        </div>
        <div style={{ fontSize: 50 }}>{person.win_rate}%</div>
      </CircularProgressbarWithChildren>
      <CircularProgressbarWithChildren
        value={person.achievements_rate}
        styles={buildStyles({
          pathColor: `rgba(95, 202, 228, 1)`,
          textColor: "#FFFFFF",
          trailColor: "#323644",
          backgroundColor: "#3e98c7",
        })}
      >
        <div style={{ fontSize: 30, color: "#B2B2B2", marginTop: -20 }}>
          Trophies
        </div>
        <div style={{ fontSize: 50 }}>{person.achievements_rate}%</div>
      </CircularProgressbarWithChildren>
    </div>
  );
}

interface ProfileProps {
  profileList: string;
  show: string;
  setRender: React.Dispatch<React.SetStateAction<string>>;
}

function getLevelStart(person: { level: number }) {
  let levelStartIndex = person.level.toString().lastIndexOf(".") + 1;
  let levelStart = "";
  if (levelStartIndex != 0)
    levelStart = person.level.toString().slice(levelStartIndex);
  else levelStart = "0";
  return Number(levelStart);
}

function Profile({ profileList, show, setRender }: ProfileProps) {
  const profileLevelStyle =
    profileList === "RenderList" ? divStyleProfile : divStyleDashboard;
  const boolRender = profileList === "RenderList" ? true : false;
  const [data, setData] = React.useState<any>({});

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/me");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const obj = {
    username: data.username ? data.username : "Dawdaw",
    first_name: data.first_name ? data.first_name : "First",
    last_name: data.last_name ? data.last_name : " Last",
    avatar: data.avatar ? data.avatar : "/bacharG.svg",
    friends: data.friends ? data.friends : [0],
    win_rate: data.win_rate ? data.win_rate : 0,
    level: data.level ? data.level : 0,
    achievements_rate: data.achievements_rate ? data.achievements_rate : 0,
    achievements: data.achievements ? data.achievements : [0],
    items: data.items ? data.items : [0],
    games: data.games ? data.games : [0],
  };
  console.log();

  console.log("profile user" + obj.username);
  let levelStart = getLevelStart(obj) * 100;
  return (
    <div id="Profile">
      <div className="profile-left">
        <div id="profile-usr">
          <img id="profile-img" src={"/bacharG.svg"} alt="profilePic" />
          <h1 id="user-name">{obj.first_name + " " + obj.last_name}</h1>
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
              <h2>Level {obj.level}</h2>
              <h2>{levelStart}/1000</h2>
            </div>
            <div id="profile-level-bar">
              <progress id="progress-bar" value={levelStart} max={1000} />
            </div>
          </div>
          {boolRender && (
            <div id="profile-tabs">
              <button
                className={`${show === "History" && "ProfileToRender"} `}
                onClick={() => setRender("History")}
              >
                History
              </button>
              <button
                className={`${show === "Trophies" && "ProfileToRender"}  `}
                onClick={() => setRender("Trophies")}
              >
                Trophies
              </button>
              <button
                className={`${show === "Items" && "ProfileToRender"}`}
                onClick={() => setRender("Items")}
              >
                Items
              </button>
            </div>
          )}
        </div>
        {getCircles(obj)}
      </div>
    </div>
  );
}

export default Profile;
