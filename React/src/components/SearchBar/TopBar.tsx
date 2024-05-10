import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export function getPageName() {
  let pageName = window.location.pathname;
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

function TopBar() {
  let data: any = {};

  const obj = {
    username: data.username ? data.username : "Dawdaw",
    avatar: data.avatar ? data.avatar : "/bacharG.svg",
    friends: data.friends ? data.friends : [0],
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
