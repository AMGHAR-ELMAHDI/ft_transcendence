import { atom } from "recoil";

const LeaderData = atom({
  key: "LeaderData", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default LeaderData;
