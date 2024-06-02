import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import AddFriend from "./AddFriend";
import { GetCorrect } from "./LeaderBoardGetTop3";
import { BsPersonFillAdd } from "react-icons/bs";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import api from "../../api";

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

function UserProfile({ show, setRender, data }: UserProps) {
  const profileLevelStyle = { justifyContent: "space-between" };
  let levelStart = Math.floor(data.level / 10);
  const url = useRecoilValue(Url);
  const [pending, setPending] = useState<boolean>(false);
  const [friends, setFriends] = useState<any>({});
  let Dont: boolean = false;

  const getFriends = async () => {
    try {
      const response = await api.get("player/friends/");
      setFriends(response.data?.friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const obj = {
    UserName: data.username,
    UserId: data.id,
  };

  const sendRequest = () => {
    setPending(true);
    // localStorage.setItem(`FriendPending user1-${obj.UserName}`, "P");
    AddFriend(obj);
  };

  if (Array.isArray(friends)) {
    console.log(friends);

    friends?.map((friend: any) => {
      if (friend.username == data.username) Dont = true;
    });
  }
  console.log(pending);

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
          <div onClick={sendRequest}>
            {!pending && !Dont && (
              <div id="ProfileaddFriend">
                <BsPersonFillAdd />
              </div>
            )}
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
export default UserProfile;
