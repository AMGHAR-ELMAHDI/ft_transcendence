import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import AcessToken from "../../Atoms/AcessToken";

function TopBar() {
  // const tokenValue = useRecoilValue(AcessToken);
  return (
    <div id="TopBar">
      <div id="welcome-bar">
        <h1>Good Evening,</h1>
        <h1 id="nickName">DawDaw</h1>
        {/* <h1>{tokenValue}</h1> */}
      </div>

      <div id="search-bar">
        <input id="search" type="text" placeholder="Search" />
        <div className="NotifProfile">
          <IoNotificationsOutline id="notif" />
          <Link to={"/profile"}>
            <img className="NotifProfilePic" src="/bacharG.svg" alt="bachar" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
