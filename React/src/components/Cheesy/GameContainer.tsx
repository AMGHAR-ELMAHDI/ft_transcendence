import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import Game from "../Mnassi/Game/Game";

export default function GameContainer() {
  return (
    <>
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
