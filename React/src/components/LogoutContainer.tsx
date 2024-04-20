import SideBar from "./SideBar";
import TopBar from "./TopBar";
import FriendBar from "./FriendBar";
import Test from "./Test";

function LogoutContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Test />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default LogoutContainer;
