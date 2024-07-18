import { atom } from "recoil";

const Players = atom({
  key: "Players", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default Players;
