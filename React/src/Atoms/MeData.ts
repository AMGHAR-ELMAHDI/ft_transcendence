import { atom } from "recoil";

const MeData = atom({
  key: "MeData", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});
export default MeData;
