import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import Friendschat from "../../../Atoms/Chatfriends";
import api from "../../../api";
import ChatFriends from "./ChatFriends";
import ChatTyping from "./ChatTyping";
import Typed from "typed.js";

function ChatSystem() {
  // const [FriendsChat, SetFriendlist] = useRecoilState(Friendschat);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [BlockRerender, setRerender] = useState<boolean>(false);
  const [Blockedusers, setBlockedUsers] = useState<any[]>([]);
  const [BlockedMe, setBlockedMe] = useState<any[]>([]);
  const [myId, setmyId] = useState<number | null>(null);
  const [FriendsChat, SetFriendlist] = useState([]);

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
      const response = await api.get("player/me/");
      setBlockedUsers(response.data.blocked_users);
      setBlockedMe(response.data.blocked_me);
      setmyId(response.data.id);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyData();
    getData();
  }, [BlockRerender]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getData();
    const socket = new WebSocket(
      `wss://localhost:2500/ws/status/${token}/${1}`
    );

    socket.onopen = () => {
      console.log("[online status socket ] conected successfully !!!");
    };

    socket.onmessage = (event) => {
      getData();
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const emptyDataElement = document.querySelector("#text");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["You dont have any friends yet. Add some to chat with them!"],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
        showCursor: false,
      });

      return () => {
        socket.close();
        typed.destroy();
      };
    }
  }, []);

  if (!FriendsChat.length) {
    return (
      <div id="lonely">
        <p id="text"></p>
      </div>
    );
  }

  return (
    <>
      <div className="Chat-wrapper">
        <div className="Friends-menu">
          <ChatFriends
            setRerender={setRerender}
            BlockedMe={BlockedMe}
            Blockedusers={Blockedusers}
            setBlockedUsers={setBlockedUsers}
            setBlockedMe={setBlockedMe}
            myId={myId}
            friends={FriendsChat}
          />
        </div>
        <div className="iamJustALine"></div>
        <div className="Chat-box-menu">
          <ChatTyping
            socket={socket}
            setSocket={setSocket}
            Blockedusers={Blockedusers}
            BlockedMe={BlockedMe}
            myId={myId}
            friends={FriendsChat}
          />
        </div>
      </div>
    </>
  );
}

export default ChatSystem;
