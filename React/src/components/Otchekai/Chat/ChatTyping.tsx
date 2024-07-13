import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import FriendId from "../../../Atoms/FriendId";
import api from "../../../api";
import SelectedFriend from "../../../Atoms/SelectedFriend";
import { MdEmojiEmotions } from "react-icons/md";
import Sender from "./Sender";
import EmojiPicker from "emoji-picker-react";
import Friendschat from "../../../Atoms/Chatfriends";
import { GetCorrect } from "../../Cheesy/LeaderBoardGetTop3";
import Url from "../../../Atoms/Url";

interface Friend {
  id: number;
  username: string;
  avatar: string;
}

interface Props {
  socket: any;
  setSocket: any;
  Blockedusers: any;
  myId: any;
  BlockedMe: any;
}

function ChatTyping({
  socket,
  setSocket,
  Blockedusers,
  myId,
  BlockedMe,
}: Props) {
  const UsersData: Friend[] = useRecoilValue(Friendschat);
  const id = useRecoilValue(FriendId);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const Selectedfriend = useRecoilValue(SelectedFriend);
  const Friend = UsersData.find((f) => f.id === Selectedfriend);
  const url = useRecoilValue(Url);
  const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
  const connType = 1;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const chatSocket = new WebSocket(
      `ws://localhost:2500/ws/chat/${id}/${token}`
    );
    setSocket(chatSocket);
    chatSocket.onopen = function () {
      console.log("WebSocket connection established (tcha9lib blawr).");
    };

    const fetchInitialMessages = async () => {
      try {
        const response = await api.get(`messages/${id}/`);
        setAllMessages(
          response.data.sort(
            (a: { id: number }, b: { id: number }) => a.id - b.id
          )
        );
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };
    fetchInitialMessages();

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const msg = {
        content: data["message"],
        timestamp: new Date(),
        sender: data["sender"],
      };
      setAllMessages((prevMessages) => [...prevMessages, msg]);
    };
    return () => {
      chatSocket.close();
    };
  }, [id]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection not open (ga3ma tcha9lib).");
      return;
    }

    const input = document.getElementById("message-input");
    const messageContent = (input as HTMLInputElement).value.trim();

    if (messageContent !== "") {
      const message = {
        content: messageContent,
      };
      socket.send(JSON.stringify(message));
      (input as HTMLInputElement).value = "";
    }
  };

  function extractTime(timestampString: any) {
    const dateObject = new Date(timestampString);
    const desiredTime = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return desiredTime;
  }

  const handleInvite = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const gameSocket = new WebSocket(
      `ws://localhost:2500/ws/single-game/${token}`
    );
    setGameSocket(gameSocket);
    console.log(gameSocket);

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
  };

  return (
    <>
      <div className="Chat-typer-wrapper">
        <div className="Header-box-chat">
          <div className="Friend-header">
            <div className="negotiator">
              <div className="Friend-header-img">
                <img src={GetCorrect(Friend?.avatar, url)} id="chatperson" />
              </div>
              <div className="Friend-header-name">
                <li>{Friend?.username || "Select a friend"}</li>
                <p>online</p>
              </div>
            </div>
          </div>
        </div>
        <div className="Type-wrapper">
          <div className="Chat-box">
            {allMessages.map((msg: any, index) => (
              <Sender
                key={index}
                message={msg.content}
                time={extractTime(msg.timestamp)}
                sender={msg.sender}
                currentUserId={id}
              />
            ))}
          </div>
          <form onSubmit={sendMessage} id="Chat-input">
            <div className="Input-box">
              <input
                id="message-input"
                type="text"
                disabled={Blockedusers.some(
                  (user: any) => user.id === Selectedfriend
                )}
                placeholder="Type Something ..."
              />
            </div>
            <button type="submit" className="Chat-send-button">
              <img src="/Send-button.svg" id="bottona" />
            </button>
            <div id="toz">
              <MdEmojiEmotions id="emoji-button" />
            </div>
            {/* <EmojiPicker /> */}
            <button
              type="submit"
              className="Chat-send-button"
              onClick={handleInvite}
            >
              <img src="/GameInvite.svg" id="bottona-dyal-les-jox" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default ChatTyping;
