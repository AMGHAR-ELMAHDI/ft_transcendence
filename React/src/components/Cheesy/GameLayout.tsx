import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import OnlineStatus from "../zmakhkha/OnlineStatus";
import { setAuthToken } from "../Utils/setAuthToken";
import Game from "../Mnassi/Game/Game";
import { Outlet } from "react-router-dom";

export default function GameLayout() {
  const token: any = localStorage.getItem("token");
  setAuthToken();

  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
