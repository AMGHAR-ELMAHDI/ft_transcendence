import { atom } from "recoil";

const Username = atom({
  key: "Username", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default Username;
