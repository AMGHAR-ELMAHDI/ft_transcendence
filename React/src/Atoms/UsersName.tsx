import { atom } from "recoil";

const UsersName = atom({
  key: "UsersName", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default UsersName;
