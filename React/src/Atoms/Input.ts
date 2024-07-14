import { atom } from "recoil";

const Input = atom({
  key: "Input", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default Input;
