import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import Friendschat from "../../../Atoms/Chatfriends";
import FriendId from "../../../Atoms/FriendId";
import { ImBlocked } from "react-icons/im";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";
import Url from "../../../Atoms/Url";

interface Friend {
  id: number;
  username: string;
  avatar: string;
}

function ChatFriends({
  Blockedusers,
  setBlockedUsers,
  myId,
  BlockedMe,
  setBlockedMe,
}: any) {
  const Friends: Friend[] = useRecoilValue(Friendschat);
  const [Friendid, setId] = useRecoilState(FriendId);
  const [selectedfriend, setSelectedFriend] = useRecoilState(SelectedFriend);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const url = useRecoilValue(Url);

  const getID = (id: number) => {
    setId(id);
    setSelectedFriend(id);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const newSocket = new WebSocket(
      `ws://localhost:2500/ws/block-unblock/${token}`
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection established successfully.");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "block") {
        setBlockedUsers((prevBlockedUsers: any) => [
          ...prevBlockedUsers,
          data.blocked,
        ]);
      } else if (data.action === "unblock") {
        setBlockedUsers((prevBlockedUsers: any) =>
          prevBlockedUsers.filter((id: number) => id !== data.unblocked)
        );
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
    if (socket) {
      const blockMessage = {
        action: "block",
        blocked: Friendid,
        blocker: myId,
      };
      socket.send(JSON.stringify(blockMessage));
      const newBlockedUser = {
        id: Friendid,
        username: Friends.find((f) => f.id === Friendid)?.username,
      };
      const newBlockedUsers = [...Blockedusers, newBlockedUser];
      setBlockedUsers(newBlockedUsers);
      console.log("User has been blocked successfully");
    }
  };

  const handleUnblock = () => {
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
    if (Friends.length > 0) getID(Friends[0].id);
  }, [Friends]);

  const Status = "O";
  return (
    <>
      <h1 id="Chatlogo">Friends</h1>
      <div className="ChatFriendsContainer">
        {Friends.map((item: any) => (
          <div
            className={`Chat-Friendslist ${
              selectedfriend === item.id ? "Other-Chat-Friendslist" : ""
            }`}
            key={item.id}
            onClick={() => getID(item.id)}
          >
            <div className="Friend-img">
              <div className="chatImgNameContainer">
                <img src={GetCorrect(item?.avatar, url)} className="bachar" />
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
              <ImBlocked />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatFriends;
