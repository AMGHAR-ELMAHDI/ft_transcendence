import { useEffect, useState } from "react";

interface Props {
  id: number; // Assuming `id` is the receiver's ID for the game invite
}

function GameInviteButton({ id }: Props) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const gameSocket = new WebSocket(
      `wss://${import.meta.env.VITE_WS_URL}ws/single-game/${token}`
    );
    setSocket(gameSocket);
    gameSocket.onopen = function () {
      const inviteMessage = {
        action: "invite",
        invite_to: id,
      };
      gameSocket.send(JSON.stringify(inviteMessage));
    };

    return () => {
      gameSocket.close();
    };
  }, [id]);

  return <button type="submit">Send Game Invite</button>;
}

export default GameInviteButton;
