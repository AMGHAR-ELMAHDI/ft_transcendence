import { atom } from "recoil";

const ChatSocket = atom<WebSocket | null>({
  key: "ChatSocket", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
export default ChatSocket;

