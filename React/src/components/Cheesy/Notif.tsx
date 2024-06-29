import { useEffect, useState, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import RenderNotif from "../../Atoms/RenderNotif";
import api from "../../api";
import LoadingData from "./LoadingData";

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

function Notif (){
  const [received, setReceived] = useState<FriendshipRequest[]>([]);
  const [render, setRender] = useRecoilState(RenderNotif);
  const [isLoading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const socket = useRef<WebSocket | null>(null);

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

  useEffect(() => {
    getPlayers();
    getData();
    const token = localStorage.getItem("token");
    socket.current = new WebSocket(`ws://localhost:2500/ws/friend-reqs/${token}`);

    socket.current.onopen = () => {
      console.log("[Notif] WebSocket connection established");
    };
    
    socket.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(`[Notif] ${data.type}`);
      if (data.type === "new_friend_request" || data.type === "friend_request_accepted" || data.type === "friend_request_denied") {
        getData(); // Fetch updated friend requests
      }
    };

    socket.current.onclose = () => {
      console.log("[Notif] WebSocket connection closed");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleAccept = (from_user: number, notif_id: number) => {
    console.log('accepted the user')
    socket.current?.send(JSON.stringify({
      action: "accept",
      friend: from_user,
    }));
    const notif = document.getElementById(notif_id.toString())
    notif?.classList.add('hideIt')
    notif!.textContent = "Friend Request Accepted"
  };

  const handleDecline = (from_user: number) => {
    socket.current?.send(JSON.stringify({
      action: "deny",
      friend: from_user,
    }));
  };

  const filteredItems = received.filter((user) =>
    user.status.includes("P")
  );

  const reRender = () => {
    setRender(!render);
    getPlayers();
    getData();
  };

  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="notif-relative" onClick={reRender}>
          <div>
            <IoNotificationsOutline id="notif" />
            {filteredItems.length > 0 && <div id="notifRedDot"></div>}
          </div>
          {render && filteredItems.length > 0 && (
            <div id="NotifPopUp">
              {filteredItems.map((notif) => (
                <div className="notif-item" key={notif.id} id={notif.id.toString()}>
                  <h4>{GetUserName(players, notif.from_user)}</h4>
                  <button onClick={() => handleAccept(notif.from_user, notif.id)}>
                    Accept
                  </button>
                  <button onClick={() => handleDecline(notif.from_user)}>
                    Decline
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notif;
