import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import Players from "../../Atoms/Players";

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

function Notif() {
  const [received, setReceived] = useState<any>([]);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/friends");
      console.log("Received invites:" + response.data?.recieved);
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

  filteredItems?.map?.((user:any) => {
    console.log("satttttttt: " + user.status);
  })

  const accept = async (id: number) => {
    try {
      const response = await axios.put("http://localhost:2500/friends/", {
        from_user: id,
        to_user: 1,
        status: "A",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const decline = async (id: number) => {
    try {
      const response = await axios.put("http://localhost:2500/friends/", {
        from_user: id,
        to_user: 1,
        status: "R",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notif-relative">
      <IoNotificationsOutline id="notif" />
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
    </div>
  );
}

export default Notif;
