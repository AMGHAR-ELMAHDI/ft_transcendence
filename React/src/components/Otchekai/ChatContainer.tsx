import { useRecoilState, useRecoilValue } from "recoil";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import { useEffect, useState } from "react";
import Friendschat from "../../Atoms/Chatfriends";
import FriendId from "../../Atoms/FriendId";
import api from "../../api";
import Url from "../../Atoms/Url";
import { ImBlocked } from "react-icons/im";
import { CgUnblock } from "react-icons/cg";
import ChatSocket from "../../Atoms/ChatSocket";

const host = "localhost";
const port = 2500;

function ChatContainer() {
  return (
    <>
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

function ChatSystem() {
  const [FriendsChat, SetFriendlist] = useRecoilState(Friendschat);
  const [data, setData] = useState({});
  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      SetFriendlist(response.data.friends);
      console.log(response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };
  const getMyData = async () => {
    try {
      const response = await api.get("player/me");
      setData(response.data.friends);
      console.table(response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    var RealText: string =
      "You dont have any friends yet. Add some to chat with them!";
    var text = document.getElementById("text");
    let i = 0;

    const exit = setInterval(() => {
      if (i == RealText.length - 1) clearInterval(exit);
      if (text) text!.innerHTML += RealText[i];
      i++;
    }, 50);
  }, []);
  if (FriendsChat.length === 0) {
    return (
      <div id="lonely">
        <p id="text"></p>
      </div>
    );
  } else {
    return (
      <>
        <div className="Chat-wrapper">
          <div className="Friends-menu">
            <ChatFriends />
          </div>
          <div className="Chat-box-menu">
            <ChatTyping />
          </div>
        </div>
      </>
    );
  }
}

interface Friend {
  id: number;
  username: string;
  avatar: string;
}

function ChatFriends() {
  const Friends: Friend[] = useRecoilValue(Friendschat);
  const [Friendid, setId] = useRecoilState(FriendId);
  const [chatSoc, setChatSoc] = useRecoilState(ChatSocket);

  const token = localStorage.getItem("token");
  const getInfoChat = async (id: number) => {
    try {
      const response = await api.get(`messages/${id}/`);

      console.table(response.data);
      setId(id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Friends.length > 0) {
      getInfoChat(Friends[0].id);
    }
  }, [Friends]);
  //TODO:ADD block button
  return (
    <>
      <div className="Friends-wrapper">
        <h1 id="Chatlogo">Friends</h1>
        {Friends.map((item: any) => (
          <div
            className="Chat-Friendslist"
            key={item.id}
            onClick={() => getInfoChat(item.id)}
          >
            <div className="Friend-img">
              <img
                src={`http://${host}:${port}/${item.avatar}`}
                className="bachar"
              />
            </div>
            <div className="Name-messages">
              <li id="Friend-name">{item.username}</li>
            </div>
            <div className="Block-button">
              <ImBlocked />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
interface MessageInfo {
  name: string;
  message: string;
  time: string;
}

function Sender({ name, message, time }: MessageInfo) {
  return (
    <>
      <div className="Sender">
        <div className="Sender-container">
          <div className="Sender-message">
            <p>{message}</p>
          </div>
          <div className="Sender-name-img">
            <div className="Sender-message-name">
              <p>{time}</p>
              <li>{name}</li>
            </div>
            <div className="Sender-message-img">
              <img src="/bacharG.svg" id="bachar" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//TODO:sort messages by time
//FIXME:responsive design
//TODO:check whether on two clients at the same time (receiver and sender)
//TODO:automatic scrollwheel
function ChatTyping() {
  const friendInfo = useRecoilValue(Friendschat);
  const url = useRecoilValue(Url);
  const id = useRecoilValue(FriendId);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);

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
        setAllMessages(response.data);
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

  const handleBlock = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const blockSocket = new WebSocket(
      `ws://localhost:2500/ws/block-unblock/${token}`
    );
    setSocket(blockSocket);

    blockSocket.onopen = function () {
      console.log("[blockSocket] Connection established successfully.");
      const inviteMessage = {
        action: "block",
        blocked: id,
      };
      blockSocket.send(JSON.stringify(inviteMessage));
    };

    blockSocket.onclose = function () {
      console.log("[blockSocket] Connection closed successfully.");
    };

    return () => {
      blockSocket.close();
    };
  };
  const handleUnblock = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const unblockSocket = new WebSocket(
      `ws://localhost:2500/ws/block-unblock/${token}`
    );
    setSocket(unblockSocket);

    unblockSocket.onopen = function () {
      console.log("[unblockSocket] Connection established successfully.");
      const inviteMessage = {
        action: "block",
        blocked: id,
      };
      unblockSocket.send(JSON.stringify(inviteMessage));
    };

    unblockSocket.onclose = function () {
      console.log("[unblockSocket] Connection closed successfully.");
    };

    return () => {
      unblockSocket.close();
    };
  };

  const handleInvite = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const gameSocket = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );
    setSocket(gameSocket);

    gameSocket.onopen = function () {
      console.log("[GameSocket] Connection established successfully.");
      const inviteMessage = {
        action: "invite",
        invite_to: id,
      };
      gameSocket.send(JSON.stringify(inviteMessage));
    };

    gameSocket.onclose = function () {
      console.log("[GameSocket] Connection closed successfully.");
    };

    return () => {
      gameSocket.close();
    };
  };

  return (
    <>
      <div className="Chat-typer-wrapper">
        <div className="Header-box-chat">
          <div className="Friend-header">
            {friendInfo.map((item: any, index) => (
              <div className="negotiator" key={index}>
                <div className="Friend-header-img">
                  <img src={`${url}${item.avatar}`} id="chatperson" />
                </div>
                <div className="Friend-header-name">
                  <li>{item.username}</li>
                  <p>online</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="Type-wrapper">
          <div className="Chat-box">
            {allMessages.map((msg: any) => (
              <Sender
                key={msg.id}
                message={msg.content}
                time={extractTime(msg.timestamp)}
                name="You"
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
              <img src="/GameInvite.svg" id="bottona" onClick={handleInvite} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
