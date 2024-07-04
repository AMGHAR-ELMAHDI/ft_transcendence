import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import Game from "../Mnassi/Game/Game";
import OnlineStatus from "../zmakhkha/OnlineStatus";

export default function GameContainer() {
  const token: any = localStorage.getItem("token");

  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Game />
        </div>
      </div>
    </>
  );
}
