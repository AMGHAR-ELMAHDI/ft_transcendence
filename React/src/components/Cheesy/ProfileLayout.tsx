import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import { Outlet } from "react-router-dom";
function ProfileLayout() {
  return (
    <>
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
