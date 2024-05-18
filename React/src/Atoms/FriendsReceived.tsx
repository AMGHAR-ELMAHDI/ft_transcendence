import { atom } from "recoil";

const FriendsReceived = atom({
  key: "FriendsReceived", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default FriendsReceived;
