import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import FriendId from "../../../Atoms/FriendId";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";
import Url from "../../../Atoms/Url";
import api from "../../../api";
import ChatFriendComponent from "./ChatFriendComponent";

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
  myId,
  Blockedusers,
  setBlockedUsers,
  setRerender,
}: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);

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
    const token = localStorage.getItem("token");
    getFriends();
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
    };
  }, []);

  return (
    <>
      <h1 id="Chatlogo">Friends</h1>
      <div className="ChatFriendsContainer">
        {friends.map((item: Friend) => (
          <ChatFriendComponent
            key={item.id}
            friend={item}
            myId={myId}
            Blockedusers={Blockedusers}
            setBlockedUsers={setBlockedUsers}
            setRerender={setRerender}
            FriendsList={friends}
          />
        ))}
      </div>
    </>
  );
}

export default ChatFriends;
