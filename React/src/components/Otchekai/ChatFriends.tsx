import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import Friendschat from "../../Atoms/Chatfriends";
import FriendId from "../../Atoms/FriendId";
import { ImBlocked } from "react-icons/im";
import SelectedFriend from "../../Atoms/SelectedFriend";

interface Friend {
  id: number;
  username: string;
  avatar: string;
}

function ChatFriends() {
  const Friends: Friend[] = useRecoilValue(Friendschat);
  const [Friendid, setId] = useRecoilState(FriendId);
  const [selectedfriend, setSelectedFriend] = useRecoilState(SelectedFriend);

  const getID = (id: number) => {
    setId(id);
    setSelectedFriend(id);
  };

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

  const Status = "O";
  //TODO:ADD block button
  return (
    <>
      <div className="Friends-wrapper">
        <h1 id="Chatlogo">Friends</h1>
        {Friends.map((item: any) => (
          <div
            className={`Chat-Friendslist ${
              selectedfriend === item.id ? "Other-Chat-Friendslist" : ""
            }`}
            key={item.id}
            onClick={() => getID(item.id)}
          >
            <div className="Friend-img">
              <img src="/avatar.svg" className="bachar" />
              <div
                className={`status-circle ${
                  Status === "O" ? "status-circle-online" : ""
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
export default ChatFriends;
