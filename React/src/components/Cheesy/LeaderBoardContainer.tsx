import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import LeaderBoardMain from "./LeaderBoardMain";

function LeaderBoardContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <div className="LeaderBoard">
            <LeaderBoardMain />
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default LeaderBoardContainer;
