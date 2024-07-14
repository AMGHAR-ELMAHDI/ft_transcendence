import React, { useEffect } from "react";

interface OnlineStatusProps {
  token: string | null;
  type: number;
}

interface Message {
  type: string;
  data: any;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ token, type }) => {
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:2500/ws/status/${token}/${type}`
    );

    socket.onopen = () => {
      console.log("[online socket ] conected successfully !!!");
      
    };

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log(message);
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  return <></>;
};

export default OnlineStatus;
