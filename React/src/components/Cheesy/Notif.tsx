import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import RenderNotif from "../../Atoms/RenderNotif";
import api from "../../api";
import LoadingData from "./LoadingData";

function GetUserName(players: any, from_user: number) {
  let name: string = "";
  if (Array.isArray(players) && players.length) {
    players?.map((user: any) => {
      if (user?.id === from_user) name = user?.username;
    });
  }
  return name;
}

// if (localStorage.getItem(`FriendPending user1-${UserName}`))
//   localStorage.removeItem(`FriendPending user1-${UserName}`);

const accept = async (id: number, UserName: string) => {
  try {
    const response = await api.put("reqs/", {
      from_user: id,
      status: "A",
    });
  } catch (error) {
    console.log(error);
  }
};

const decline = async (id: number, UserName: string) => {
  try {
    const response = await api.put("reqs/", {
      from_user: id,
      status: "R",
    });
  } catch (error) {
    console.log(error);
  }
};

function Notif() {
  const [received, setReceived] = useState<any>([]);
  const [render, setRender] = useRecoilState(RenderNotif);
  const [isLoading, setLoading] = useState(true);
  // const [displayRedDot, setDisplayRedDot] = useState(false);
  const [players, setPlayers] = useState<any>([]);

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
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = received.filter((user: any) =>
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
        LoadingData()
      ) : (
        <div className="notif-relative" onClick={reRender}>
          <div>
            <IoNotificationsOutline id="notif" />
            {filteredItems.length > 0 && <div id="notifRedDot"></div>}
          </div>
          {render && filteredItems.length > 0 && (
            <div id="NotifPopUp">
              {filteredItems.map((notif: any) => (
                <div className="notif-item" key={notif.id}>
                  <h4>{GetUserName(players, notif?.from_user)}</h4>
                  <button
                    onClick={() => accept(notif?.from_user, notif?.to_user)}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => decline(notif?.from_user, notif?.to_user)}
                  >
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
}

export default Notif;
