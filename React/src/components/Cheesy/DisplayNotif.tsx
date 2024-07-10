import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FriendshipRequest, GameInviteProps, Player } from "./Notif";
import { useNavigate } from "react-router-dom";

interface NotifProps {
  players: Player[];
  pending: GameInviteProps[];
  accepted: GameInviteProps[];
  sent: GameInviteProps[];
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

//------------------------------------------------------

function DisplayNotif({
  players,
  pending,
  accepted,
  sent,
  filteredItems,
  socketFriend,
  socketGame,
}: NotifProps) {
  const navigate = useNavigate();

  const render = () => {
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
        { id: String(num) }
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
                const inviteMessage = {
                  action: "accept",
                  id: pending[index].id,
                };
                socketGame.current?.send(JSON.stringify(inviteMessage));
                // toast.remove(String(num));
              }}
            >
              Accept
            </button>
            <button
              className="notifButton"
              onClick={() => {
                const inviteMessage = {
                  action: "deny",
                  id: pending[index].id,
                };
                socketGame.current?.send(JSON.stringify(inviteMessage));
                // toast.remove(String(num));
              }}
            >
              Decline
            </button>
          </div>
        </div>,
        { id: String(num) }
      );
    }

    for (let index = 0; index < accepted.length && index < 5; index++) {
      let num: number = Number(accepted[index].sender_username);

      toast(
        <div className="notifContainer">
          <h1>You Accepted {accepted[index].sender_username}'s invite</h1>
          <div className="notifButtonContainer">
            <button
              className="notifButton"
              onClick={() => {
                toast.success(
                  "You Accepted" +
                    accepted[index].sender_username +
                    "'s invite",
                  { duration: 1000000000000 }
                );
                localStorage.setItem("invite_id", String(accepted[index].id));
                toast.remove(String(num));
                navigate("/gametst");
              }}
            >
              Join
            </button>
            <button
              className="notifButton"
              onClick={() => {
                // toast.dismiss(String(num));
              }}
            >
              Decline
            </button>
          </div>
        </div>,
        { id: String(num) }
      );
    }

    for (let index = 0; index < sent.length && index < 5; index++) {
      let num: number = Number(sent[index].sender_username);

      toast(
        <div className="notifContainer">
          <h1>{sent[index].sender_username} Accepted Your invite</h1>
          <div className="notifButtonContainer">
            <button
              className="notifButton"
              onClick={() => {
                toast.success(
                  sent[index].sender_username + "Accepted Your invite",
                  { duration: 1000000000000 }
                );
                localStorage.setItem("invite_id", String(sent[index].id));

                toast.remove(String(num));
                navigate("/gametst");
              }}
            >
              Join
            </button>
            <button
              className="notifButton"
              onClick={() => {
                // toast.dismiss(String(num));
              }}
            >
              Decline
            </button>
          </div>
        </div>,
        { id: String(num) }
      );
    }
  };

  useEffect(() => {
    render();
  }, [
    players,
    pending,
    accepted,
    sent,
    filteredItems,
    socketFriend,
    socketGame,
  ]);
}
export default DisplayNotif;
