import { atom } from "recoil";

const BlockedMe = atom({
  key: "BlockedMe", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default BlockedMe;
