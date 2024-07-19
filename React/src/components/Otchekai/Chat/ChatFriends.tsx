import ChatFriendComponent from "./ChatFriendComponent";

export interface Friend {
  id: number;
  status: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  level: number;
  coins: 0;
}

interface Props {
  Blockedusers: any;
  setBlockedUsers: any;
  myId: any;
  BlockedMe: any;
  setBlockedMe: any;
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
  friends: Friend[];
}

function ChatFriends({
  myId,
  Blockedusers,
  setBlockedUsers,
  setRerender,
  friends,
}: Props) {
  return (
    <>
      <h1 id="Chatlogo">Friends</h1>
      <div className="ChatFriendsContainer">
        {friends.map((item: Friend) => (
          <ChatFriendComponent
            key={item.id}
            friend={item}
            myId={myId}
            Blockedusers={Blockedusers}
            setBlockedUsers={setBlockedUsers}
            setRerender={setRerender}
            FriendsList={friends}
          />
        ))}
      </div>
    </>
  );
}

export default ChatFriends;
