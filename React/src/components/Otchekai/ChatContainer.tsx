import { useRecoilState, useRecoilValue } from "recoil";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { useEffect, useState } from "react";
import Friendschat from "../../Atoms/Chatfriends";
import FriendId from "../../Atoms/FriendId";
import api from "../../api";
import Url from "../../Atoms/Url";
import { ImBlocked } from "react-icons/im";
import { CgUnblock } from "react-icons/cg";
import OnlineStatus from "../zmakhkha/OnlineStatus";
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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [BlockedUsers, setBlockedUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState<string>("");

  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      SetFriendlist(response.data.friends);
      console.log("hh", response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyData = async () => {
    try {
      const response = await api.get("player/me");
      setData(response.data);
      setBlockedUsers(response.data.blocked_users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getMyData();
    var RealText: string =
      "You dont have any friends yet. Add some to chat with them!";
    var text = document.getElementById("text");
    let i = 0;
    const exit = setInterval(() => {
      if (i == RealText.length - 1) clearInterval(exit);
      if (text) text!.innerHTML += RealText[i];
      i++;
    }, 50);
  }, [, socket]);

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
            <ChatTyping
              BlockedUsers={BlockedUsers}
              socket={socket}
              setSocket={setSocket}
            />
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
  status: string;
}

function ChatFriends() {
  const Friends: Friend[] = useRecoilValue(Friendschat);
  const [Friendid, setId] = useRecoilState(FriendId);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const result = Friends.find(({ name }: any) => name === "status");

  const getID = (id: number) => {
    setId(id);
    setSelectedFriend(id);
  };
  console.log(selectedFriend);
  const handleBlock = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const blockSocket = new WebSocket(
      `ws://localhost:2500/ws/block-unblock/${token}`
    );

    blockSocket.onopen = function () {
      console.log("[blockSocket] Connection established successfully.");
      const inviteMessage = {
        action: "block",
        blocked: Friendid,
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

    unblockSocket.onopen = function () {
      console.log("[unblockSocket] Connection established successfully.");
      const inviteMessage = {
        action: "block",
        blocked: Friendid,
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

  useEffect(() => {
    if (Friends.length > 0) getID(Friends[0].id);
  }, [Friends]);

  //TODO:ADD block button
  return (
    <>
      <div className="Friends-wrapper">
        <h1 id="Chatlogo">Friends</h1>
        {Friends.map((item: any) => (
          <div
            className={`Chat-Friendslist ${
              selectedFriend === item.id ? "Other-Chat-Friendslist" : ""
            }`}
            key={item.id}
            onClick={() => getID(item.id)}
          >
            <div className="Friend-img">
              <img src="/avatar.svg" className="bachar" />
              <div
                className={`status-circle ${
                  item.status === "O" ? "status-circle-online" : ""
                }`}
              ></div>
            </div>
            <div className="Name-messages">
              <li id="Friend-name">{item.username}</li>
            </div>
            <div onClick={handleBlock} className="Block-button">
              <ImBlocked />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

interface MessageInfo {
  message: string;
  time: string;
  sender: number;
  currentUserId: number;
}

function Sender({ message, time, sender, currentUserId }: MessageInfo) {
  const isCurrentUser = sender === currentUserId;
  return (
    <div
      className={`Sender ${isCurrentUser ? "Sender-other" : "Sender-current"}`}
    >
      <div className="Sender-container">
        <div className="Sender-message">
          <p>{message}</p>
          <div className="Sender-message-name">
            <p>{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

//TODO:automatic scrollwheel
function ChatTyping({
  socket,
  setSocket,
  BlockedUsers,
}: {
  socket: any;
  setSocket: any;
  BlockedUsers: any;
}) {
  const id = useRecoilValue(FriendId);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
  const token = localStorage.getItem("token");
  const connType = 1;
  useEffect(() => {
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
      <OnlineStatus token={token} type={connType} />
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
            <button
              type="submit"
              className="Chat-send-button"
              onClick={handleInvite}
            >
              <img src="/GameInvite.svg" id="bottona-dyal-les-jox" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
