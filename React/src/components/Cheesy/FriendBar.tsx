import React, { useEffect } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";

function FriendBar() {
  const [data, setData] = React.useState<any>([]);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/me");
      setData(response.data.friends);
      console.log(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div id="FriendBar">
      <div id="friend-container">
        <img className="friend-svg" id="logo-friend-svg" src="/friends.svg" />
        {Array.isArray(data) &&
          data.map((friend: any) => (
            <img
              className="friend-sb"
              key={friend?.id}
              src={"http://localhost:2500/" + friend?.avatar}
            />
          ))}
      </div>
    </div>
  );
}

export default FriendBar;
