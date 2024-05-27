import { useRecoilState, useRecoilValue } from "recoil";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import Friendschat from "../../Atoms/Chatfriends";
import Chatmessages from "../../Atoms/ChatMessages";
import FriendId from "../../Atoms/FriendId";
import Url from "../../Atoms/Url";
import Input from "../../Atoms/Input";
import ChatSocket from "../../Atoms/ChatSocket";
import { GetCorrect } from "../Cheesy/LeaderBoardGetTop3";

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
      const response = await axios.get(
        `http://${host}:${port}/player/friends/`
      );
      SetFriendlist(response.data.friends);
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
  const [ChatMessages, SetMessages] = useRecoilState(Chatmessages);

  const [Friendid, setId] = useRecoilState(FriendId);
  const [chatSoc, setChatSoc] = useRecoilState(ChatSocket);
  const url = useRecoilValue(Url);
  const getInfoChat = async (id: number) => {
    const socket = new WebSocket(`ws://localhost:2500/ws/chat/${id}/`);
    socket.onopen = function (event) {
      console.log("WebSocket connection established.");
      event.preventDefault();
    };

    // setChatSoc(socket);
    try {
      const response = await axios.get(
        `http://${host}:${port}/messages/${id}/`
      );
      SetMessages(response.data);
      console.log(response.data);
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
              <img src={GetCorrect(item.avatar, url)} className="bachar" />
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
  time: string;
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

function ChatTyping() {
  const messages = useRecoilValue(Chatmessages);

  const id = useRecoilValue(FriendId);
  const [input, setInput] = useRecoilState(Input);
  const [submit, setSubmit] = useState(true);
  const [chatSoc, setChatSoc] = useRecoilState(ChatSocket);
  // if (input == " ") setSubmit(false);
  // else setSubmit(true);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const message = {
      content: input,
    };

    // Check if WebSocket is in OPEN state before sending message
    if (chatSoc && chatSoc.readyState === WebSocket.OPEN) {
      // Send the message as JSON
      chatSoc.send(JSON.stringify(message));
      setInput(""); // Assuming setInput is a function to update input state
    } else {
      console.error("WebSocket connection not open yet.");
    }
  };

  return (
    <>
      <div className="Type-wrapper">
        <div className="Chat-box">
          {messages.map((msg: any, index: any) => (
            <div key={index}>
              {msg.sender != id ? (
                <Sender message={msg.content} time={msg.timestamp} name="You" />
              ) : (
                <Receiver
                  message={msg.content}
                  time={msg.timestamp}
                  name="khona"
                />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={(e) => onSubmit(e)} className="Chat-input">
          <div className="Input-box">
            <input
              type="text"
              placeholder="Type Something ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
