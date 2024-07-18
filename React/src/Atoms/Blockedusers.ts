import { atom } from "recoil";

const Blockedusers = atom({
  key: "Blockedusers", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default Blockedusers;
