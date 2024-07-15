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
      `wss://localhost:2500/ws/status/${token}/${type}`
    );

    socket.onopen = () => {};

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
    };

    socket.onclose = () => {};

    socket.onerror = (error) => {};

    if (socket.readyState === WebSocket.OPEN) {
      return () => {
        socket.close();
      };
    }
  }, [token]);

  return <></>;
};

export default OnlineStatus;
