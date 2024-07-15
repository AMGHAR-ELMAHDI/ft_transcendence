import { atom } from "recoil";

const IsLogged = atom({
  key: "IsLogged", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export default IsLogged;
