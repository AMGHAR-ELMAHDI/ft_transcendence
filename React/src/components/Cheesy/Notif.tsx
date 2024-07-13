import { useEffect, useState, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import api from "../../api";
import DisplayNotif from "./DisplayNotif";

export interface Player {
  id: number;
  username: string;
}

export interface FriendshipRequest {
  id: number;
  from_user: number;
  to_user: number;
  status: string;
}

export interface GameInviteProps {
  id: number;
  receiver: number;
  sender: number;
  room_id: number;
  status: string;
  sender_username: string;
}

function Notif() {
  const [received, setReceived] = useState<FriendshipRequest[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const socketFriend = useRef<WebSocket | null>(null);
  //-------------------------game invite
  const [pending, setPending] = useState<GameInviteProps[]>([]);
  const [accepted, setAccepted] = useState<GameInviteProps[]>([]);
  const [sent, setSent] = useState<GameInviteProps[]>([]);
  const socketGame = useRef<WebSocket | null>(null);

  //-------------------------

  const getPlayers = async () => {
    try {
      const response = await api.get("player/");
      setPlayers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await api.get("reqs/");
      setReceived(response.data?.recieved);
    } catch (error) {
      console.log(error);
    }
  };

  const getGameInvites = async () => {
    try {
      const response = await api.get("game-invites/");
      setPending(response.data?.pending);
      setAccepted(response.data?.accepted);
      setSent(response.data?.sent);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlayers();
    getData();
    //------------------------------------------Friend Invite
    const token = localStorage.getItem("token");
    socketFriend.current = new WebSocket(
      `ws://localhost:2500/ws/friend-reqs/${token}`
    );

    socketFriend.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(data);
      getData();
    };

    //------------------------------------------game Invite start
    getGameInvites();
    socketGame.current = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );

    socketGame.current.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      getGameInvites();
    };

    return () => {
      socketFriend.current?.close();
      socketGame.current?.close();
    };
    //------------------------------------------game Invite end
  }, []);

  const filteredItems = received.filter((user) => user?.status.includes("P"));

  DisplayNotif({
    players,
    pending,
    accepted,
    sent,
    filteredItems,
    socketFriend,
    socketGame,
  });

  return (
    <div
      className="notif-relative"
      onClick={() => {
        getData();
        getGameInvites();
      }}
    >
      <IoNotificationsOutline id="notif" />
      {filteredItems.length > 0 && <div id="notifRedDot"></div>}
      {pending.length > 0 && <div id="notifRedDot"></div>}
    </div>
  );
}

export default Notif;
