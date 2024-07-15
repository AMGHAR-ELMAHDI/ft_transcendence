import React, { useEffect, useState } from "react";
import { Friend } from "./ChatFriends";
import { useRecoilState, useRecoilValue } from "recoil";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import Url from "../../../Atoms/Url";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";

interface Props {
  friend: Friend;
  myId: any;
  Blockedusers: any;
  setBlockedUsers: any;
  FriendsList: Friend[];
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatFriendComponent({
  friend,
  Blockedusers,
  setBlockedUsers,
  setRerender,
  myId,
  FriendsList,
}: Props) {
  const [selectedfriend, setSelectedFriend] = useRecoilState(SelectedFriend);
  const url = useRecoilValue(Url);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsAnimated(!isAnimated);
  };

  const getID = (id: number) => {
    setSelectedFriend(id);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = new WebSocket(
      `ws://localhost:2500/ws/block-unblock/${token}`
    );
    newSocket.onopen = () => {};
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data, "data");
      if (data.action === "block") {
        setBlockedUsers((prevBlockedUsers: any) => [
          ...prevBlockedUsers,
          data.blocked,
        ]);
      } else if (data.action === "unblock") {
        setBlockedUsers((prevBlockedUsers: any) =>
          prevBlockedUsers.filter((id: number) => id !== data.unblocked)
        );
      } else if (data.action === "game_update") {
        setRerender((e: any) => !e);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  const handleBlock = () => {
    setRerender((e) => !e);
    if (socket) {
      const blockMessage = {
        action: "block",
        blocked: selectedfriend,
        blocker: myId,
      };
      socket.send(JSON.stringify(blockMessage));
      const newBlockedUser = {
        id: selectedfriend,
        username: FriendsList.find((f: Friend) => f.id === selectedfriend)
          ?.username,
      };
      const newBlockedUsers = [...Blockedusers, newBlockedUser];
      setBlockedUsers(newBlockedUsers);
      console.log("User has been blocked successfully");
    }
  };

  const handleUnblock = () => {
    setRerender((e) => !e);
    if (socket) {
      const blockMessage = {
        action: "unblock",
        blocked: selectedfriend,
        blocker: myId,
      };
      socket.send(JSON.stringify(blockMessage));
      const newBlockedUsers = Blockedusers.filter(
        (user: any) => user.id !== selectedfriend
      );
      setBlockedUsers(newBlockedUsers);
      console.log("User has been unblocked successfully");
    }
  };

  return (
    <div
      className={`Chat-Friendslist ${
        selectedfriend === friend.id ? "Other-Chat-Friendslist" : ""
      }`}
      onClick={() => getID(friend.id)}
    >
      <div className="Friend-img">
        <div className="chatImgNameContainer">
          <img src={GetCorrect(friend.avatar, url)} className="Friend-imgImg" />
          <div
            className={`status-circle ${
              friend.status === "O" ? "status-circle-online" : ""
            }`}
          ></div>
        </div>

        <h1 id="Friend-name">{friend.username}</h1>
      </div>
      <div
        onClick={
          Blockedusers.some((user: any) => user.id === friend.id)
            ? handleUnblock
            : handleBlock
        }
        className="Block-button"
      >
        <div
          className={`block ${isAnimated ? "animateParent" : ""}`}
          onClick={handleClick}
        >
          <div className={`line ${isAnimated ? "animate" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}

export default ChatFriendComponent;
