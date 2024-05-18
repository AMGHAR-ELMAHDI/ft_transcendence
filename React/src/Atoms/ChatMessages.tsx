import { atom } from "recoil";

const Chatmessages = atom({
  key: "Chatmessages", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default Chatmessages;
