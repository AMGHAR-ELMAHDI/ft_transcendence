import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";

function FriendBar() {
  const [data, setData] = React.useState<any>([]);
  const [showList, setShowList] = React.useState<any>(false);
  const [renderName, setRenderName] = useState<boolean>(false);
  const url = useRecoilValue(Url);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      setData(response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div id="FriendBar">
      <div
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
        id="friend-container"
      >
        <img className="friend-svg" id="logo-friend-svg" src="/friends.svg" />
        {Array.isArray(data) &&
          showList &&
          data.map((friend: any) => (
            <div
              className="Friend-Relat"
              key={friend?.id}
              onMouseEnter={() => setRenderName(true)}
              onMouseLeave={() => setRenderName(false)}
            >
              <img className="friend-sb" src={url + friend?.avatar} />
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
