import SideBar from "./SideBar";
import TopBar from "./TopBar";

function ChatContainer() {
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

export default ChatContainer;
