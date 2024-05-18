import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import Player from "./Player";

export default function GameContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Player />
        </div>
      </div>
    </>
  );
}
