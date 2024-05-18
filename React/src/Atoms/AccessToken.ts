import { atom } from "recoil";

const AcessToken = atom({
  key: "AcessToken", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default AcessToken;
