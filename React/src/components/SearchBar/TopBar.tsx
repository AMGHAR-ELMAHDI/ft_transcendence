import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getMeData } from "../Utils/GetMeData";

export function getPageName() {
  let pageName = window.location.pathname;
  if (pageName === "/") pageName = "Home";
  return pageName;
}

function TopBar() {
  let data: any = getMeData();

  const obj = {
    avatar: data.avatar ? data.avatar : "/bacharG.svg",
    friends: data.friends ? data.friends : [0],
  };

  return (
    <div id="TopBar">
      <div id="welcome-bar">
        <h1 id="nickName">{getPageName()}</h1>
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
        <div className="NotifProfile">
          <IoNotificationsOutline id="notif" />
          <Link to={"/profile"}>
            <img className="NotifProfilePic" src={obj.avatar} alt="bachar" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
