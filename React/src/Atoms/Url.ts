import { atom } from "recoil";

const Url = atom({
  key: "Url", // unique ID (with respect to other atoms/selectors)
  default: "http://localhost:2500/", // default value (aka initial value)
});
export default Url;
