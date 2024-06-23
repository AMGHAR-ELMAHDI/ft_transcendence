import React, { useEffect, useState } from "react";

interface OnlineStatusProps {
  token: string | null;
  type: number;
}

interface Message {
  type: string;
  data: any;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ token, type }) => {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:2500/ws/status/${token}/${type}`
    );

    socket.onopen = () => {
      setConnectionStatus("Connected");
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log(message);
    };

    socket.onclose = (event) => {
      setConnectionStatus("Disconnected");
      console.log("WebSocket closed:", event);
    };

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
