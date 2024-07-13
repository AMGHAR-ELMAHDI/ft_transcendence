import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import LeaderBoardMain from "./LeaderBoardMain";
import OnlineStatus from "../zmakhkha/OnlineStatus";

function LeaderBoardContainer() {
  const token: any = localStorage.getItem("token");
  return (
    <>
      <OnlineStatus token={token} type={1} />
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
