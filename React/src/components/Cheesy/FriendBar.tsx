import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";

function FriendBar() {
  const [data, setData] = React.useState<any>([]);
  const [showList, setShowList] = React.useState<any>(false);
  const [renderName, setRenderName] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(true);
  const url = useRecoilValue(Url);

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
        {isLoading && LoadingData()}
        {!isLoading &&
          Array.isArray(data) &&
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
