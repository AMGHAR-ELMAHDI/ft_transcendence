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
          <TopBar />
          <LeaderBoardMain />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default LeaderBoardContainer;
