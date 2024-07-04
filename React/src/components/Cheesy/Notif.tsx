import { useEffect, useState, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import RenderNotif from "../../Atoms/RenderNotif";
import api from "../../api";
import LoadingData from "./LoadingData";
import toast from "react-hot-toast";

interface Player {
  id: number;
  username: string;
}

interface FriendshipRequest {
  id: number;
  from_user: number;
  to_user: number;
  status: string;
}

function GetUserName(players: Player[], from_user: number): string {
  let name = "";
  players.forEach((user) => {
    if (user.id === from_user) {
      name = user.username;
    }
  });
  return name;
}

interface GameInviteProps {
  id: number;
  receiver: number;
  sender: number;
  room_id: number;
  status: string;
  sender_username: string;
}

function Notif() {
  const [received, setReceived] = useState<FriendshipRequest[]>([]);
  const [render, setRender] = useRecoilState(RenderNotif);
  const [isLoading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const socket = useRef<WebSocket | null>(null);
  //-------------------------game invite
  const [pending, setPending] = useState<GameInviteProps[]>([]);
  const [accepted, setAccepted] = useState<GameInviteProps[]>([]);
  const [sent, setSent] = useState<GameInviteProps[]>([]);
  const gameSocket = useRef<WebSocket | null>(null);

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
      // const response = await api.get("game-invites/");
      setReceived(response.data?.recieved);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
    socket.current = new WebSocket(
      `ws://localhost:2500/ws/friend-reqs/${token}`
    );

    socket.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(`[Notif] data Type:  ${data.type}`);
      const message = data["message"];
      console.log(`[Message] ${message}`);

      if (
        data.type === "new_friend_request" ||
        data.type === "friend_request_accepted" ||
        data.type === "friend_request_denied"
      ) {
        getData();
      }
    };

    //------------------------------------------game Invite start
    getGameInvites();
    gameSocket.current = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );
    console.log("here1");

    gameSocket.current.onmessage = (event: MessageEvent) => {
      console.log("here2");
      const data = JSON.parse(event.data);
      console.log(JSON.stringify(data));
      getGameInvites();
    };

    return () => {
      socket.current?.close();
      gameSocket.current?.close();
    };
    //------------------------------------------game Invite end
  }, []);

  const handleAccept = (from_user: number) => {
    socket.current?.send(
      JSON.stringify({
        action: "accept",
        friend: from_user,
      })
    );
  };

  const handleDecline = (from_user: number) => {
    socket.current?.send(
      JSON.stringify({
        action: "deny",
        friend: from_user,
      })
    );
  };

  const filteredItems = received.filter((user) => user.status.includes("P"));

  const reRender = () => {
    setRender(!render);
    getPlayers();
    getData();
  };

  for (let index = 0; index < filteredItems.length; index++) {
    let num = filteredItems[index]?.from_user;

    toast(
      <>
        <h1>Friend Request From :</h1>
        <h1>{GetUserName(players, num)}</h1>
        <button className="notifButton" onClick={() => handleAccept(num)}>
          Accept
        </button>
        <button className="notifButton" onClick={() => handleDecline(num)}>
          Accept
        </button>
      </>,
      { id: String(num), duration: 10000 }
    );
  }

  for (let index = 0; index < pending.length && index < 5; index++) {
    let num: number = Number(pending[index].sender_username);

    toast(
      <div className="notifContainer">
        <h1>Game Invite From {pending[index].sender_username}</h1>
        <div className="notifButtonContainer">
          <button
            className="notifButton"
            onClick={() => {
              handleAccept(num);
              toast.remove();
            }}
          >
            Join
          </button>
          <button className="notifButton" onClick={() => handleDecline(num)}>
            Decline
          </button>
        </div>
      </div>,
      { id: String(num), duration: 2000 }
    );
  }

  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="notif-relative" onClick={reRender}>
          <div>
            <IoNotificationsOutline id="notif" />
            {filteredItems.length > 0 && <div id="notifRedDot"></div>}
            {pending.length > 0 && <div id="notifRedDot"></div>}
          </div>
        </div>
      )}
    </>
  );
}

export default Notif;
