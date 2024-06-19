import { useEffect, useRef } from "react";

interface Props {
  UserName: string;
  UserId: number;
}

function AddFriend({ UserName, UserId }: Props) {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    socket.current = new WebSocket(
      `ws://localhost:2500/ws/friend-reqs/${token}`
    );

    socket.current.onopen = () => {
      console.log("[Notif] WebSocket connection established");
    };

    socket.current.onmessage = (event: MessageEvent) => {};

    socket.current.onclose = () => {
      console.log("[Notif] WebSocket connection closed");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleAddFriend = () => {
    if (socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "create",
          friend: UserId,
        })
      );
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return <button onClick={handleAddFriend}>Add {UserName} as Friend</button>;
  return null;
}

export default AddFriend;
