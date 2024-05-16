import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from "../Utils/setAuthToken";
import { BsPersonFillAdd } from "react-icons/bs";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProfileMain from "./ProfileMain";

function getLevelStart(person: { level: number }) {
  let levelStartIndex = person.level.toString().lastIndexOf(".") + 1;
  let levelStart = "";
  if (levelStartIndex != 0)
    levelStart = person.level.toString().slice(levelStartIndex);
  else levelStart = "0";
  return Number(levelStart);
}

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

interface UserProps {
  show: string;
  setRender: React.Dispatch<React.SetStateAction<string>>;
  data: {
    username: string;
    first_name: string;
    last_name: string;
    image: string;
    level: number;
    coins: number;
    email: string;
    win_rate: number;
    achievements_rate: number;
  };
}

function addFriend(UserName: string) {
  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/friends");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  getData();
}

function UserProfile({ show, setRender, data }: UserProps) {
  const profileLevelStyle = { justifyContent: "space-between" };
  let levelStart = getLevelStart(data) * 100;
  console.log(data.image);

  return (
    <div id="Profile">
      <div className="profile-left">
        <div id="profile-usr">
          <img
            id="profile-img"
            src={"http://localhost:2500" + data.image?.substring(6)}
            alt="profilePic"
          />
          <h1 id="user-name">{data.username}</h1>
        </div>
        <div className="line1">
          <div className="line2"></div>
          <div id="ProfileaddFriend">
            <BsPersonFillAdd onClick={() => addFriend(data.username)} />
          </div>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-level" style={profileLevelStyle}>
          <div></div>
          <div id="profile-level-container">
            <div id="profile-level-text">
              <h2>Level {data?.level}</h2>
              <h2>{levelStart}/1000</h2>
            </div>
            <div id="profile-level-bar">
              <progress id="progress-bar" value={levelStart} max={1000} />
            </div>
          </div>
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
        </div>
        {getCircles(data)}
      </div>
    </div>
  );
}

function Users() {
  const [render, setRender] = useState<string>("History");
  const UserData: any = useLoaderData();

  return (
    <>
      <UserProfile show={render} setRender={setRender} data={UserData[0]} />
      <ProfileMain inRender={render} UserData={UserData} UseUserData={true} />
    </>
  );
}

export const UsersLoader = async ({ params }: { params: any }) => {
  const { username } = params;
  setAuthToken();
  try {
    const response = await axios.get(
      "http://localhost:2500/search/" + username
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default Users;
