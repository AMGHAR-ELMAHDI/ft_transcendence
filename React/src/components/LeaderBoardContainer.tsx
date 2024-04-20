import SideBar from "./SideBar";
import TopBar from "./TopBar";
import FriendBar from "./FriendBar";
import LeaderBoardMain from "./LeaderBoardMain";

function LeaderBoardContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <div className="topBarLeaderBoard">
            <TopBar />
          </div>
          <LeaderBoardMain />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default LeaderBoardContainer;