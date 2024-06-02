import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { setAuthToken } from "../Utils/setAuthToken";
import { BsPersonFillAdd } from "react-icons/bs";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProfileMain from "./ProfileMain";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import { GetCorrect } from "./LeaderBoardGetTop3";
import Profile from "./Profile";

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
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    level: number;
    coins: number;
    email: string;
    win_rate: number;
    achievements_rate: number;
  };
}

function addFriend(UserName: string, UserId: number, url: string) {
  const putData = async () => {
    try {
      const response = await api.post("reqs/", {
        to_user: UserId,
        status: "P",
      });
      console.log("PUT: " + response.data);
    } catch (error) {
      console.log(error);
    }
  };
  putData();
}

function UserProfile({ show, setRender, data }: UserProps) {
  const profileLevelStyle = { justifyContent: "space-between" };
  let levelStart = Math.floor(data.level / 10);
  const url = useRecoilValue(Url);

  return (
    <div id="Profile">
      <div className="profile-left">
        <div id="profile-usr">
          <img
            id="profile-img"
            src={GetCorrect(data.avatar, url)}
            alt="profilePic"
          />
          <h1 id="user-name">{data.username}</h1>
        </div>
        <div className="line1">
          <div className="line2"></div>
          <div id="ProfileaddFriend">
            <BsPersonFillAdd
              onClick={() => addFriend(data.username, data.id, url)}
            />
          </div>
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-level" style={profileLevelStyle}>
          <div></div>
          <div id="profile-level-container">
            <div id="profile-level-text">
              <h2>Level {Math.floor(data.level / 1000)}</h2>
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

  if (UserData === null) {
    return (
      <>
        <Profile profileList="RenderList" show={render} setRender={setRender} />
        <ProfileMain inRender={render} UseUserData={false} />
      </>
    );
  }

  return (
    <>
      <UserProfile show={render} setRender={setRender} data={UserData} />
      <ProfileMain inRender={render} UserData={UserData} UseUserData={true} />
    </>
  );
}

export const UsersLoader = async ({ params }: { params: any }) => {
  const { username } = params;

  setAuthToken();
  try {
    const response = await api.get(`player/${username}/me/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default Users;
