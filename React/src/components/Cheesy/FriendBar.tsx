import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilState, useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";
import Online from "../../Atoms/ProfilePic";

interface Message {
  type: string;
  data: any;
}

function FriendBar() {
  const [data, setData] = React.useState<any>([]);
  const [showList, setShowList] = React.useState<boolean>(false);
  const [renderName, setRenderName] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(true);
  const url = useRecoilValue(Url);

  const token = localStorage.getItem("token");
  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      setData(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    const socket = new WebSocket(`ws://localhost:2500/ws/status/${token}/${1}`);

    socket.onopen = () => {
      console.log("[online socket ] conected successfully !!!");
    };

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log("--------------------------------------");
      console.log("HERER MESSAGE FRIEND BAR: " + JSON.stringify(message));
      console.log("--------------------------------------");
      getData();
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div id="FriendBar">
      <div
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
        id="friend-container"
      >
        <img
          onClick={getData}
          className="friend-svg"
          id="logo-friend-svg"
          src="/friends.svg"
        />
        {isLoading
          ? LoadingData()
          : Array.isArray(data) &&
            showList &&
            data.map((friend: any) => (
              <div
                className="Friend-Relat"
                key={friend?.id}
                onMouseEnter={() => setRenderName(true)}
                onMouseLeave={() => setRenderName(false)}
                onClick={() => {
                  navigate(`/profile/${friend?.username}`);
                }}
              >
                <img
                  className="friend-sb"
                  src={GetCorrect(friend?.avatar, url)}
                />
                <div
                  className={
                    friend?.status == "O"
                      ? "friendIconOnline"
                      : "friendIconOffline"
                  }
                ></div>

                {renderName && (
                  <h1 className="friend-bar-username">{friend?.username}</h1>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}

export default FriendBar;
