interface MessageInfo {
  message: string;
  time: string;
  sender: number;
  currentUserId: number;
}

function Sender({ message, time, sender, currentUserId }: MessageInfo) {
  const isCurrentUser = sender === currentUserId;
  return (
    <div
      className={`Sender ${isCurrentUser ? "Sender-other" : "Sender-current"}`}
    >
      <div className="Sender-message">
        <p>{message}</p>
        <div className="Sender-message-name">
          <p>{time}</p>
        </div>
      </div>
    </div>
  );
}
export default Sender;
