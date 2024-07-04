import { useEffect, useState } from "react";

interface Props {
  id: number; // Assuming `id` is the receiver's ID for the game invite
}

function GameInviteButton({ id }: Props) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
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
        action: "invite",
        invite_to: id,
      };
      gameSocket.send(JSON.stringify(inviteMessage));
    };

    gameSocket.onclose = function () {
      console.log("[GameSocket] Connection closed successfully.");
    };

    return () => {
      gameSocket.close();
    };
  }, [id]);

  return <button type="submit">Send Game Invite</button>;
}

export default GameInviteButton;