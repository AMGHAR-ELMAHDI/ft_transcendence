import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";

export default function GameContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
        </div>
      </div>
    </>
  );
}
