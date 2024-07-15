import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import FriendId from "../../../Atoms/FriendId";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";
import Url from "../../../Atoms/Url";
import api from "../../../api";

export interface Friend {
  id: number;
  status: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  level: number;
  coins: 0;
}

interface Props {
  Blockedusers: any;
  setBlockedUsers: any;
  myId: any;
  BlockedMe: any;
  setBlockedMe: any;
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatFriends({
  Blockedusers,
  setBlockedUsers,
  myId,
  BlockedMe,
  setBlockedMe,
  setRerender,
}: Props) {
  const [Friendid, setId] = useRecoilState(FriendId);
  const [selectedfriend, setSelectedFriend] = useRecoilState(SelectedFriend);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const url = useRecoilValue(Url);

  const getID = (id: number) => {
    setId(id);
    setSelectedFriend(id);
  };

  const getFriends = async () => {
    try {
      const response = await api.get("player/friends/");

      setFriends(response.data.friends);
      console.log(response.data.friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
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
        setRerender((e) => !e);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    setSocket(newSocket);
    //-------------------------------------Online Socket-------------------------------------
    const socket = new WebSocket(`ws://localhost:2500/ws/status/${token}/${1}`);

    socket.onopen = () => {
      console.log("[online status socket ] conected successfully !!!");
    };

    socket.onmessage = (event) => {
      getFriends();
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
      newSocket.close();
    };
  }, []);

  const handleBlock = () => {
    setRerender((e) => !e);
    if (socket) {
      const blockMessage = {
        action: "block",
        blocked: Friendid,
        blocker: myId,
      };
      socket.send(JSON.stringify(blockMessage));
      const newBlockedUser = {
        id: Friendid,
        username: friends.find((f: Friend) => f.id === Friendid)?.username,
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
        blocked: Friendid,
        blocker: myId,
      };
      socket.send(JSON.stringify(blockMessage));
      const newBlockedUsers = Blockedusers.filter(
        (user: any) => user.id !== Friendid
      );
      setBlockedUsers(newBlockedUsers);
      console.log("User has been unblocked successfully");
    }
  };

  useEffect(() => {
    if (friends.length > 0) getID(friends[0].id);
  }, [friends]);

  const Status = "O";

  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsAnimated(!isAnimated);
  };

  return (
    <>
      <h1 id="Chatlogo">Friends</h1>
      <div className="ChatFriendsContainer">
        {friends.map((item: any) => (
          <div
            className={`Chat-Friendslist ${
              selectedfriend === item.id ? "Other-Chat-Friendslist" : ""
            }`}
            key={item.id}
            onClick={() => getID(item.id)}
          >
            <div className="Friend-img">
              <div className="chatImgNameContainer">
                <img
                  src={GetCorrect(item?.avatar, url)}
                  className="Friend-imgImg"
                />
                <div
                  className={`status-circle ${
                    Status === "O" ? "status-circle-online" : ""
                  }`}
                ></div>
              </div>

              <h1 id="Friend-name">{item.username}</h1>
            </div>
            <div
              onClick={
                Blockedusers.some((user: any) => user.id === item.id)
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
        ))}
      </div>
    </>
  );
}

export default ChatFriends;
