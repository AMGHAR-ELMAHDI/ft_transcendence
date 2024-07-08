import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import Profile from "./Profile";
import FriendBar from "./FriendBar";
import Dashboard from "./Dashboard";
import { useState } from "react";
import OnlineStatus from "../zmakhkha/OnlineStatus";

function DashboardContainer() {
  const [render, setRender] = useState<string>("History");
  const token: any = localStorage.getItem("token");

  const getCookie = (name: string) => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    console.log(cookies);

    return cookies ? cookies.split("=")[1] : null;
  };

  const username = getCookie("access");
  const cookies = document.cookie;
  console.log(cookies);

  console.log(username);

  return (
    <>
      {/* <OnlineStatus token={token} type={1} /> */}
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Profile profileList="Dont" show={render} setRender={setRender} />
          <Dashboard />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default DashboardContainer;
