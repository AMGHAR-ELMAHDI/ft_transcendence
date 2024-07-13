import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import Friendschat from "../../../Atoms/Chatfriends";
import api from "../../../api";
import ChatFriends from "./ChatFriends";
import ChatTyping from "./ChatTyping";

function ChatSystem() {
  const [FriendsChat, SetFriendlist] = useRecoilState(Friendschat);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [Blockedusers, setBlockedUsers] = useState<any[]>([]);
  const [BlockedMe, setBlockedMe] = useState<any[]>([]);
  const [myId, setmyId] = useState<number | null>(null);

  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      SetFriendlist(response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyData = async () => {
    try {
      const response = await api.get("player/me");
      setBlockedUsers(response.data.blocked_users);
      setBlockedMe(response.data.blocked_me);
      setmyId(response.data.id);
      console.log(response.data);
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
            <ChatFriends
              Blockedusers={Blockedusers}
              setBlockedUsers={setBlockedUsers}
              BlockedMe={BlockedMe}
              setBlockedMe={setBlockedMe}
              myId={myId}
            />
          </div>
          <div className="Chat-box-menu">
            <ChatTyping
              socket={socket}
              setSocket={setSocket}
              Blockedusers={Blockedusers}
              BlockedMe={BlockedMe}
              myId={myId}
            />
          </div>
        </div>
      </>
    );
  }
}
export default ChatSystem;
