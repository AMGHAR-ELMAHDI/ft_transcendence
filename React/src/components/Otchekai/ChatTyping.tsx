import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import FriendId from "../../Atoms/FriendId";
import api from "../../api";
import BlockedUsers from "../../Atoms/BlockedUsers";
import SelectedFriend from "../../Atoms/SelectedFriend";
import Sender from "./Sender";

function ChatTyping({ socket, setSocket }: { socket: any; setSocket: any }) {
  const Blockedusers = useRecoilValue(BlockedUsers);
  const id = useRecoilValue(FriendId);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const Selectedfriend = useRecoilValue(SelectedFriend);

  console.log("hada ra mblocki", Blockedusers);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = new WebSocket(
      `ws://localhost:2500/ws/chat/${id}/${token}`
    );
    setSocket(newSocket);
    newSocket.onopen = function () {
      console.log("WebSocket connection established (tcha9lib blawr).");
    };

    const fetchInitialMessages = async () => {
      try {
        const response = await api.get(`messages/${id}/`);
        setAllMessages(
          response.data.sort(
            (a: { id: number }, b: { id: number }) => a.id - b.id
          )
        );
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };
    fetchInitialMessages();

    newSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const msg = {
        content: data["message"],
        timestamp: new Date(),
        sender: data["sender"],
      };
      setAllMessages((prevMessages) => [...prevMessages, msg]);
    };
    return () => {
      newSocket.close();
    };
  }, [id]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection not open (ga3ma tcha9lib).");
      return;
    }

    const input = document.getElementById("message-input");
    const messageContent = (input as HTMLInputElement).value.trim();

    if (messageContent !== "") {
      const message = {
        content: messageContent,
      };
      socket.send(JSON.stringify(message));
      (input as HTMLInputElement).value = "";
    }
  };

  function extractTime(timestampString: any) {
    const dateObject = new Date(timestampString);
    const desiredTime = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return desiredTime;
  }

  return (
    <>
      <div className="Chat-typer-wrapper">
        <div className="Header-box-chat">
          <div className="Friend-header">
            <div className="negotiator">
              <div className="Friend-header-img">
                <img src="/avatar.svg" id="chatperson" />
              </div>
              <div className="Friend-header-name">
                <li>DawDaw</li>
                <p>online</p>
              </div>
            </div>
          </div>
        </div>
        <div className="Type-wrapper">
          <div className="Chat-box">
            {allMessages.map((msg: any, index) => (
              <Sender
                key={index}
                message={msg.content}
                time={extractTime(msg.timestamp)}
                sender={msg.sender}
                currentUserId={id}
              />
            ))}
          </div>
          <form onSubmit={sendMessage} id="Chat-input">
            <div className="Input-box">
              <input
                id="message-input"
                type="text"
                placeholder="Type Something ..."
              />
            </div>
            <button type="submit" className="Chat-send-button">
              <img src="/Send-button.svg" id="bottona" />
            </button>
            <button type="submit" className="Chat-send-button">
              <img src="/GameInvite.svg" id="bottona-dyal-les-jox" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default ChatTyping;
