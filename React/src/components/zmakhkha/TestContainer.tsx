import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { useEffect, useState } from "react";
import api from "../../api";
import OnlineStatus from "./OnlineStatus";

interface GameInviteProps {
  id: number;
  receiver: number;
  sender: number;
  room_id: number;
  status: string;
  sender_username: string;
}

function TestContainer() {
  const [pending, setPending] = useState<GameInviteProps[]>([]);
  const [accepted, setAccepted] = useState<GameInviteProps[]>([]);
  const [sent, setSent] = useState<GameInviteProps[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const token = localStorage.getItem("token");
  const connType = 1;
  const sendResponse = (index: number, status: string) => {
    console.log(`[${index}]haaaahua accepta !!`);

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
      getData();
    };

    gameSocket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(`[GAME] data Type:  ${data.type}`);
      console.log(`[Message-+|] ${JSON.stringify(data)}`);

      if (data.type === "game_request_update") {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaah')
        getData();
      }
    };

    gameSocket.onclose = function () {
      console.log("[GameSocket] Connection closed successfully.");
    };

    return () => {
      gameSocket.close();
    };
  };

  const getData = async () => {
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
    getData();
  }, [socket]);

  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <OnlineStatus token={token} type={connType} />
          <h1>users invites</h1>
          <div>
            {pending.map((invite, index) => (
              <div key={index}>
                <div id="container" className="flex-container-row">
                  <div id="image">
                    <img
                      id="invite-img"
                      src="https://cdn.intra.42.fr/users/fe126cc601d93b711a24bbd332f6184b/zmakhkha.jpg"
                      alt=""
                    />
                  </div>
                  <div id="info" className="flex-container-col">
                    <div id="username">{invite.sender_username}</div>
                    <div id="message">
                      [invitation N : {invite.id}]Do you wanna play a pong game
                      ?
                    </div>
                  </div>
                  <div id="action" className="flex-container-col">
                    <button
                      className="sub-button"
                      onClick={() => sendResponse(invite.id, "accept")}
                      id="accept"
                    >
                      Accept
                    </button>
                    <button
                      className="sub-button"
                      onClick={() => sendResponse(invite.id, "deny")}
                      id="deny"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr className="rounded"></hr>
          <h1>accepted invitations</h1>
          {accepted.map((invite, index) => (
            <div>
              [invitation {invite.id}] You have accepted{" "}
              {invite.sender_username}'s invitation. Click{" "}
              <a href="/game/join">here</a> to join the game.
            </div>
          ))}
          <hr className="rounded"></hr>
          <h1>Sent and accepted</h1>
          {sent.map((invite, index) => (
            <div>
              [invitation {invite.id}] You have accepted{" "}
              {invite.sender_username}'s invitation. Click{" "}
              <a href="/game/join">here</a> to join the game.
            </div>
          ))}
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default TestContainer;
