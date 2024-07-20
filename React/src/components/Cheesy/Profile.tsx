import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";
import GetCircles from "./GetCircles";

const divStyleDashboard = { justifyContent: "center" };

const divStyleProfile = { justifyContent: "space-between" };

interface ProfileProps {
  profileList: string;
  show: string;
  setRender: React.Dispatch<React.SetStateAction<string>>;
}

function Profile({ profileList, show, setRender }: ProfileProps) {
  const profileLevelStyle =
    profileList === "RenderList" ? divStyleProfile : divStyleDashboard;
  const boolRender = profileList === "RenderList" ? true : false;
  const [data, setData] = useState<any>({});
  const url = useRecoilValue(Url);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await api.get("player/me/");
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const obj = {
    username: data.username,
    avatar: data.avatar,
    friends: data.friends,
    win_rate: data.win_rate,
    level: data.level,
    points: data.points,
    achievements_rate: data.achievements_rate,
    achievements: data.achievements,
  };

  return (
    <>
      {isLoading && LoadingData()}
      {!isLoading && (
        <div id="Profile">
          <div className="profile-left">
            <div id="profile-usr">
              <img
                id="profile-img"
                src={GetCorrect(obj.avatar, url)}
                alt="profilePic"
              />
              <h1 id="user-name">{obj.username}</h1>
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
                  <h2>{Math.floor(obj.points % 1000)}/1000</h2>
                </div>
                <div id="profile-level-bar">
                  <progress id="progress-bar" value={obj.points} max={1000} />
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
                  <button
                    className={`${show === "Friends" && "ProfileToRender"}`}
                    onClick={() => setRender("Friends")}
                  >
                    Friends
                  </button>
                </div>
              )}
            </div>
            {GetCircles(obj)}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
