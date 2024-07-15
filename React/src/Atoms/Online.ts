import { atom } from "recoil";

const Online = atom({
  key: "Online", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export default Online;
