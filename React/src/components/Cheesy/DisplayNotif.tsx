import React from "react";
import toast from "react-hot-toast";
import { FriendshipRequest, GameInviteProps, Player } from "./Notif";

interface NotifProps {
  players: Player[];
  pending: GameInviteProps[];
  filteredItems: FriendshipRequest[];
  socketFriend: React.MutableRefObject<WebSocket | null>;
  socketGame: React.MutableRefObject<WebSocket | null>;
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

const acceptFriend = (
  from_user: number,
  socket: React.MutableRefObject<WebSocket | null>
) => {
  socket.current?.send(
    JSON.stringify({
      action: "accept",
      friend: from_user,
    })
  );
};

const declineFriend = (
  from_user: number,
  socket: React.MutableRefObject<WebSocket | null>
) => {
  socket.current?.send(
    JSON.stringify({
      action: "deny",
      friend: from_user,
    })
  );
};

const acceptGame = (
  from_user: number,
  socket: React.MutableRefObject<WebSocket | null>
) => {
  socket.current?.send(
    JSON.stringify({
      action: "accept",
      friend: from_user,
    })
  );
};

const declineGame = (
  from_user: number,
  socket: React.MutableRefObject<WebSocket | null>
) => {
  socket.current?.send(
    JSON.stringify({
      action: "deny",
      friend: from_user,
    })
  );
};

function DisplayNotif({
  players,
  pending,
  filteredItems,
  socketFriend,
  socketGame,
}: NotifProps) {
  for (let index = 0; index < filteredItems.length; index++) {
    let num = filteredItems[index]?.from_user;

    toast(
      <div className="notifContainer">
        <h1>Friend Request From {GetUserName(players, num)}</h1>
        <div className="notifButtonContainer">
          <button
            className="notifButton"
            onClick={() => {
              acceptFriend(num, socketFriend);
              toast.dismiss(String(num));
            }}
          >
            Accept
          </button>
          <button
            className="notifButton"
            onClick={() => {
              declineFriend(num, socketFriend);
              toast.dismiss(String(num));
            }}
          >
            Decline
          </button>
        </div>
      </div>,
      { id: String(num), duration: 1000 }
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
              acceptGame(num, socketGame);
              toast.dismiss(String(num));
            }}
          >
            Join
          </button>
          <button
            className="notifButton"
            onClick={() => {
              declineGame(num, socketGame);
              toast.dismiss(String(num));
            }}
          >
            Decline
          </button>
        </div>
      </div>,
      { id: String(num), duration: 1000 }
    );
  }
}
export default DisplayNotif;
