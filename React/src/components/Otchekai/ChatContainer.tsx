import { useRecoilState, useRecoilValue } from "recoil";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import Friendschat from "../../Atoms/Chatfriends";
import FriendId from "../../Atoms/FriendId";
import api from "../../api";
import Url from "../../Atoms/Url";

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
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="Chat-wrapper">
        <div className="Chat-headers">
          <h1 id="Chatlogo">Friends</h1>
          <div className="Friend-header">
            <div className="Friend-header-img">
              <img src="/bacharG.svg" id="bachar" />
            </div>
            <div className="Friend-header-name">
              <li>Micheal The Nigger</li>
              <p>online</p>
            </div>
          </div>
        </div>
        <div className="Chat-container">
          <ChatFriends />
          <ChatTyping />
        </div>
      </div>
    </>
  );
}

function ChatFriends() {
  const Friends = useRecoilValue(Friendschat);
  const [Friendid, setId] = useRecoilState(FriendId);
  const url = useRecoilValue(Url);
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
    // if (Friends.length > 0) {
    // getInfoChat(Friends[0].id);
    // }
  }, [Friends]);
  return (
    <>
      <div className="Friends-wrapper">
        {/* <p id="LastMessages">Messages (TBD)</p> */}
        {Friends.map((item: any) => (
          <div
            className="Chat-Friendslist"
            key={item.id}
            onClick={() => getInfoChat(item.id)}
          >
            <div className="Friend-img">
              <img src={`${url}${item.avatar}`} className="bachar" />
            </div>
            <div className="Name-messages">
              <li id="Friend-name">{item.username}</li>
              <p id="Last-message">mbanch lik dek mahdi bghit n...</p>
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
}

function Receiver({ message }: MessageInfo) {
  return (
    <>
      <div className="Receiver">
        <div className="First-message">
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}

function Sender({ name, message}: MessageInfo) {
  return (
    <>
      <div className="Sender">
        <div className="Sender-container">
          <div className="Sender-message">
            <p>{message}</p>
          </div>
          <div className="Sender-name-img">
            <div className="Sender-message-name">
              {/* <p>{time}</p> */}
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

function ChatTyping() {
  const id = useRecoilValue(FriendId);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:2500/ws/chat/${id}/`);
    setSocket(newSocket);
    newSocket.onopen = function () {
      console.log("WebSocket connection established.");
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
        timestamp: data["timestamp"],
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
      console.error("WebSocket connection not open.");
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

  return (
    <>
      <div className="Type-wrapper">
        <div className="Chat-box">
          {allMessages.map((msg: any, index) => (
            <div key={index}>
              {msg.sender !== id ? (
                <Sender message={msg.content} name="You" />
              ) : (
                <Receiver
                  message={msg.content}
                  name="Friend"
                />
              )}
            </div>
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
          <div className="Chat-send-button">
            <img src="/Send-button.svg" id="bottona" />
          </div>
        </form>
      </div>
    </>
  );
}
