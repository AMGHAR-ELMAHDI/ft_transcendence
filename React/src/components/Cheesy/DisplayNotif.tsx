import React from "react";
import toast from "react-hot-toast";

interface NotifProps {
  players: Player[];
  pending: GameInviteProps[];
  filteredItems: FriendshipRequest[];
  socket: React.MutableRefObject<WebSocket | null>;
}

interface FriendshipRequest {
  id: number;
  from_user: number;
  to_user: number;
  status: string;
}

interface GameInviteProps {
  id: number;
  receiver: number;
  sender: number;
  room_id: number;
  status: string;
  sender_username: string;
}

interface Player {
  id: number;
  username: string;
}

function GetUserName(players: Player[], from_user: number): string {
  let name = "";
  players.forEach((user) => {
    if (user.id === from_user) {
      name = user.username;
    }
  });
  return name;
}

function DisplayNotif({ players, pending, filteredItems, socket }: NotifProps) {
  for (let index = 0; index < filteredItems.length; index++) {
    let num = filteredItems[index]?.from_user;

    toast(
      <div className="notifContainer">
        <h1>Friend Request From {GetUserName(players, num)}</h1>
        <div className="notifButtonContainer">
          <button className="notifButton" onClick={() => handleAccept(num)}>
            Accept
          </button>
          <button className="notifButton" onClick={() => handleDecline(num)}>
            Decline
          </button>
        </div>
      </div>,
      { id: String(num), duration: 10000 }
    );
  }

  for (let index = 0; index < pending.length && index < 5; index++) {
    let num: number = Number(pending[index].sender_username);

    toast(
      <div className="notifContainer">
        <h1>Game Invite From {pending[index].sender_username}</h1>
        <div className="notifButtonContainer">
          <button
            className="notifButton"
            onClick={() => {
              handleAccept(num);
              toast.remove();
            }}
          >
            Join
          </button>
          <button className="notifButton" onClick={() => handleDecline(num)}>
            Decline
          </button>
        </div>
      </div>,
      { id: String(num), duration: 10000 }
    );
  }

  const handleAccept = (from_user: number) => {
    socket.current?.send(
      JSON.stringify({
        action: "accept",
        friend: from_user,
      })
    );
  };

  const handleDecline = (from_user: number) => {
    socket.current?.send(
      JSON.stringify({
        action: "deny",
        friend: from_user,
      })
    );
  };
}
export default DisplayNotif;
