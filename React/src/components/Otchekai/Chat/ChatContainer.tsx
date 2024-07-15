import { useEffect, useState } from "react";
import FriendBar from "../../Cheesy/FriendBar";
import SideBar from "../../Cheesy/SideBar";
import TopBar from "../../SearchBar/TopBar";
import OnlineStatus from "../../zmakhkha/OnlineStatus";
import ChatSystem from "./ChatSystem";

interface Message {
  type: string;
  data: any;
}

function ChatContainer() {
  const token: any = localStorage.getItem("token");
  const [statusSocket, setstatusSocket] = useState<WebSocket | null>(null);
  const type = 1;

  useEffect(() => {
    const socket = new WebSocket(
      `wss://localhost:2500/ws/status/${token}/${type}`
    );

    socket.onopen = () => {
      console.log("[online socket ] conected successfully !!!");
    };

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log(message);
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  return (
    <>
      {/* <OnlineStatus token={token} type={1} /> */}
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
