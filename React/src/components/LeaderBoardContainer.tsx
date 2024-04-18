import SideBar from "./SideBar";
import TopBar from "./TopBar";
import FriendBar from "./FriendBar";

function LeaderBoardContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default LeaderBoardContainer;
