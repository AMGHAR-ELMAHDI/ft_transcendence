import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import Players from "../../Atoms/Players";
import RenderNotif from "../../Atoms/RenderNotif";
import Url from "../../Atoms/Url";
import api from "../../api";

// function getUserName(
//   filteredItems: {
//     id: number;
//     from_user: number;
//     to_user: number;
//     status: string;
//   },
//   players: any
// ) {
//   console.log("from_user:" + filteredItems.from_user);

//   players.map((user: any) => {
//     console.log("players: " + user?.id);
//   });

//   const player = players.filter((user: any) =>
//     user?.id?.includes(filteredItems.from_user)
//   );
//   return player.username;
// }

// const [players, setPlayers] = useRecoilState(Players);

// setAuthToken();
// const getPlayers = async () => {
//   try {
//     const response = await axios.get("http://localhost:2500/player/");
//     // console.log(response.data);
//     setPlayers(response.data);
//   } catch (error) {
//     console.log(error);
//   }
// };
// useEffect(() => {
//   getPlayers();
// }, []);

const accept = async (id: number) => {
  console.log("accept: " + id);

  try {
    const response = await api.put("reqs/", {
      from_user: id,
      status: "A",
    });
  } catch (error) {
    console.log(error);
  }
};
const decline = async (id: number) => {
  console.log("decline: " + id);

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
  const url = useRecoilValue(Url);

  const getData = async () => {
    try {
      const response = await api.get("reqs/");
      setReceived(response.data?.recieved);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredItems = received.filter((user: any) =>
    user.status.includes("P")
  );

  const reRender = () => {
    setRender(!render);
    getData();
  };

  return (
    <div className="notif-relative" onClick={reRender}>
      <IoNotificationsOutline id="notif" />
      {render && filteredItems.length != 0 && (
        <div id="NotifPopUp">
          {filteredItems.map((notif: any) => (
            <div className="notif-item" key={notif.id}>
              <h4>{"fromUser:" + notif.from_user}</h4>
              {/* <h4>{"Username:" + getUserName(notif, players)}</h4> */}
              <button onClick={() => accept(notif.from_user)}>Accept</button>
              <button onClick={() => decline(notif.from_user)}>Decline</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notif;
