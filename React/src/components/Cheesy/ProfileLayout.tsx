import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import { Outlet } from "react-router-dom";
import OnlineStatus from "../zmakhkha/OnlineStatus";

function ProfileLayout() {
  const token: any = localStorage.getItem("token");

  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Outlet />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ProfileLayout;
