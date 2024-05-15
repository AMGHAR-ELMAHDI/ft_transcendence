import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import { Outlet, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import Users from "../../Atoms/UsersName";
import { useEffect } from "react";

function ProfileLayout() {
  const [data, setData] = useRecoilState(Users);

  const { username } = useParams();

  useEffect(() => {
    if (username) setData(username);
    console.log("Layout: " + data);
  }, [username, data, setData]);
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
