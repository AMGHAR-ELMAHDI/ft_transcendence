import { useEffect, useState, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import RenderNotif from "../../Atoms/RenderNotif";
import LoadingData from "./LoadingData";
import api from "../../api";

function GetUserName(players, from_user) {
  let name = "";
  if (Array.isArray(players) && players.length) {
    players.forEach((user) => {
      if (user.id === from_user) name = user.username;
    });
  }
  return name;
}

const Notif = () => {
  const [received, setReceived] = useState([]);
  const [render, setRender] = useRecoilState(RenderNotif);
  const [isLoading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const socket = useRef(null);

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

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "new_friend_request") {
        getData(); // Fetch updated friend requests
      }
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleAccept = (from_user) => {
    socket.current?.send(JSON.stringify({
      action: "accept",
      friend: from_user,
    }));
  };

  const handleDecline = (from_user) => {
    socket.current?.send(JSON.stringify({
      action: "deny",
      friend: from_user,
    }));
  };

  const filteredItems = received.filter((user) => user.status === "P");

  const reRender = () => {
    setRender(!render);
    getPlayers();
  };

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div className="notif-relative" onClick={reRender}>
          <div>
            <IoNotificationsOutline id="notif" />
            {filteredItems.length > 0 && <div id="notifRedDot"></div>}
          </div>
          {render && filteredItems.length > 0 && (
            <div id="NotifPopUp">
              {filteredItems.map((notif) => (
                <div className="notif-item" key={notif.id}>
                  <h4>{GetUserName(players, notif.from_user)}</h4>
                  <button onClick={() => handleAccept(notif.from_user)}>
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
