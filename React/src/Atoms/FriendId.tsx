import { atom } from "recoil";

const FriendId = atom({
  key: "FriendId", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});
export default FriendId;
