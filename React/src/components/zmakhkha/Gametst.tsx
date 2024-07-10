import React from "react";
import { useEffect, useRef } from "react";

function Gametst() {
  const startGameSocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const invite_id = localStorage.getItem("invite_id");
    if (!invite_id) return;
    console.log("+++++++++", +invite_id);

    startGameSocket.current = new WebSocket(
      `ws://localhost:2500/ws/start-single-game/${token}/${invite_id}`
    );

    startGameSocket.current.onmessage = (event: MessageEvent) => {};
  });

  return <div>Gametst</div>;
}

export default Gametst;
