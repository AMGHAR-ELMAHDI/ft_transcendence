import { atom } from "recoil";

const BlockedUsers = atom({
  key: "BlockedUsers", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default BlockedUsers;
