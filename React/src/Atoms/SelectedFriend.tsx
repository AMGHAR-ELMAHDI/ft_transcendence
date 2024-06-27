import { atom } from "recoil";

const SelectedFriend = atom({
  key: "SelectedFriend", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});
export default SelectedFriend;
