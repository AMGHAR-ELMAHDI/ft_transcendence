import { useRecoilState, useRecoilValue } from "recoil";
import ShopItems from "../../Atoms/ShopItems";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import OwnedItems from "../../Atoms/OwnedItems";
import api from "../../api";
import Url from "../../Atoms/Url";
import LoadingData from "../Cheesy/LoadingData";

interface GameInviteProps {
  id: number;
  receiver: number;
  sender: number;
  room_id: number;
  status: string;
  sender_username: string;
}

function TestContainer() {
  const [data, setdata] = useState<GameInviteProps[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const sendResponse = (index:number, status:string) => {
    console.log(`[${index}]haaaahua accepta !!`)
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const gameSocket = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );
    setSocket(gameSocket);

    gameSocket.onopen = function () {
      console.log("[GameSocket] Connection established successfully.");
      const inviteMessage = {
        action: status,
        id: index,
      };
      gameSocket.send(JSON.stringify(inviteMessage));
      getData()
    };
    
    gameSocket.onclose = function () {
      console.log("[GameSocket] Connection closed successfully.");
    };

    return () => {
      gameSocket.close();

    };
  }
  

  const getData = async () => {
    try {
      const response = await api.get("game-invites/");
      setdata(response.data?.pending);
      console.log("kkkkk",data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <h1>users invites</h1>

          <div>
            {data.map((invite, index) => (
              <div key = {index}>
                <div id="container" className="flex-container-row">
                  <div id="image">
                    <img
                      src="https://cdn.intra.42.fr/users/fe126cc601d93b711a24bbd332f6184b/zmakhkha.jpg"
                      alt=""
                    />
                  </div>
                  <div id="info" className="flex-container-col">
                    <div id="username">{invite.sender_username}</div>
                    <div id="message">[invitation N : {invite.id}]Do you wanna play a pong game ?</div>
                  </div>
                  <div id="action" className="flex-container-col">
                    <button onClick={() => sendResponse(invite.id, 'accept' )} id="accept">Accept</button>
                    <button onClick={() => sendResponse(invite.id, 'deny')}id="deny">Deny</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default TestContainer;
