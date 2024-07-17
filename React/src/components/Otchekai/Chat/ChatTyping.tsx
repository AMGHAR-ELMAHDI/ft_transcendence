import { useRecoilValue } from "recoil";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../api";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import Sender from "./Sender";
import Friendschat from "../../../Atoms/Chatfriends";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";
import Url from "../../../Atoms/Url";
import "../../../css/Otchekai/Chat-animation.css";

interface Friend {
  id: number;
  username: string;
  avatar: string;
  status: string;
}

interface Props {
  socket: any;
  setSocket: any;
  Blockedusers: any;
  myId: any;
  BlockedMe: any;
}

function ChatTyping({ socket, setSocket, Blockedusers, BlockedMe }: Props) {
  const UsersData: Friend[] = useRecoilValue(Friendschat);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const Selectedfriend = useRecoilValue(SelectedFriend);
  const Friend: any = UsersData.find((f) => f.id === Selectedfriend);
  const url = useRecoilValue(Url);
  const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
  const connType = 1;
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const isUserBlocked = useMemo(() => {
    return (
      Blockedusers.some((user: any) => user.id === Selectedfriend) ||
      BlockedMe.some((user: any) => user.id === Selectedfriend)
    );
  }, [Blockedusers, BlockedMe, Selectedfriend]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const chatSocket = new WebSocket(
      `ws://localhost:2500/ws/chat/${Selectedfriend}/${token}`
    );
    setSocket(chatSocket);
    chatSocket.onopen = function () {
      console.log("ChatSocket connection established");
    };

    const fetchInitialMessages = async () => {
      try {
        const response = await api.get(`messages/${Selectedfriend}/`);
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

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const msg = {
        content: data["message"],
        timestamp: new Date(),
        sender: data["sender"],
      };
      setAllMessages((prevMessages) => [...prevMessages, msg]);
    };
    return () => {
      chatSocket.close();
    };
  }, [Selectedfriend]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("ChatSocket connection not open");
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

  const handleInvite = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const gameSocket = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );
    setGameSocket(gameSocket);
    console.log(gameSocket);

    gameSocket.onopen = function () {
      const inviteMessage = {
        action: "invite",
        invite_to: Selectedfriend,
      };
      gameSocket.send(JSON.stringify(inviteMessage));
    };

    return () => {
      gameSocket.close();
    };
  };

  if (Selectedfriend === 0) {
    return (
      <div className="animation-container">
        <div className="Parent-animation">
          <div className="left_wall"></div>
          <div className="ball"></div>
          <div className="right_wall"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="negotiator">
        <img
          src={GetCorrect(Friend?.avatar, url)}
          id="chatperson"
          className={Friend?.status !== "O" ? "offline" : ""}
          alt="Friend avatar"
        />
        <div className="Friend-header-name">
          <h1>{Friend?.username}</h1>
          <h2>{Friend?.status === "O" ? "OnLine" : "OffLine"}</h2>
        </div>
      </div>
      <div className="Type-wrapper">
        <div className="Chat-box" ref={chatBoxRef}>
          {allMessages.map((msg: any, index) => (
            <Sender
              key={index}
              message={msg.content}
              time={extractTime(msg.timestamp)}
              sender={msg.sender}
              currentUserId={Selectedfriend}
            />
          ))}
        </div>
        <form onSubmit={sendMessage} id="Chat-input">
          <div className="chatInputButtonContainer">
            <input
              id="message-input"
              type="text"
              disabled={isUserBlocked}
              placeholder={
                isUserBlocked ? "The user is blocked" : "Type Something ..."
              }
            />
          </div>
          <button
            type="submit"
            className="Chat-send-button"
            disabled={isUserBlocked}
          >
            <img src="/Send-button.svg" id="bottona" />
          </button>
          <button
            type="submit"
            className="Chat-send-button"
            onClick={handleInvite}
            disabled={isUserBlocked}
          >
            <img src="/GameInvite.svg" id="bottona-dyal-les-jox" />
          </button>
        </form>
      </div>
    </>
  );
}
export default ChatTyping;
