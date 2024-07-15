import { atom } from "recoil";

const Friendschat = atom({
  key: "Friendschat", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default Friendschat;

