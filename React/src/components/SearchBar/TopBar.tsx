import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilValue } from "recoil";
import IsLogged from "../../Atoms/IsLogged";
export function getPageName() {
  let pageName = window.location.pathname;
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

function TopBar() {
  const [data, setData] = React.useState<any>({});
  const [gotData, setGotData] = React.useState(false);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/me");
      setGotData(true);
      console.log("--------------HERE-------------");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const Logged = useRecoilValue(IsLogged);

  if (Logged == true && gotData === false) getData();

  const obj = {
    username: data.username ? data.username : "Dawdaw",
    avatar: data.avatar ? data.avatar : "/bacharG.svg",
    friends: data.friends ? data.friends : [0],
    level: data.level ? data.level : 0,
  };
  let print = <h1>Good Evening,</h1>;
  let username = <h1 id="nickName">{obj.username}</h1>;
  return (
    <div id="TopBar">
      <div id="welcome-bar">
        {window.location.pathname === "/" && print}
        {window.location.pathname === "/" && username}
        {window.location.pathname !== "/" && (
          <h1 id="nickName">{getPageName()}</h1>
        )}
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
        <div className="NotifProfile">
          <IoNotificationsOutline id="notif" />
          <Link to={"/profile"}>
            <img className="NotifProfilePic" src={obj.avatar} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
