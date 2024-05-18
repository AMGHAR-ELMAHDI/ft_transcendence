import React, { useEffect } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";

function FriendBar() {
  const [data, setData] = React.useState<any>([]);
  const [showList, setShowList] = React.useState<any>(false);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://e2r7p6:2500/player/me");
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
