import FriendBar from "../../Cheesy/FriendBar";
import SideBar from "../../Cheesy/SideBar";
import TopBar from "../../SearchBar/TopBar";
import OnlineStatus from "../../zmakhkha/OnlineStatus";
import ChatSystem from "./ChatSystem";

function ChatContainer() {
  const token: any = localStorage.getItem("token");
  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <ChatSystem />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ChatContainer;
