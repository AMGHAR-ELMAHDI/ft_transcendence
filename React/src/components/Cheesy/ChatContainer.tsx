import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";

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
