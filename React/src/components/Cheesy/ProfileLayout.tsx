import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import Profile from "./Profile";
import ProfileMain from "./ProfileMain";
import FriendBar from "./FriendBar";
import { Outlet, useParams } from "react-router-dom";

function ProfileLayout() {
  const { username } = useParams();
  console.log("Layout: " + username);
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
