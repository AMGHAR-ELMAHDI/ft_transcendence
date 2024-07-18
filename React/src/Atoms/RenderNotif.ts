import { atom } from "recoil";

const RenderNotif = atom({
  key: "RenderNotif", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export default RenderNotif;
