import React, { useEffect } from "react";

interface OnlineStatusProps {
  token: string | null;
  type: number;
}

export interface Message {
  type: string;
  data: any;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ token, type }) => {
  useEffect(() => {
    const socket = new WebSocket(
      `wss://${import.meta.env.VITE_WS_URL}ws/status/${token}/${type}`
    );

    socket.onopen = () => {};

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {};

    return () => {
      socket.close();
    };
  }, [token]);

  return <></>;
};

export default OnlineStatus;
