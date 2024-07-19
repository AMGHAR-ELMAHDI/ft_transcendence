import { atom } from "recoil";

const Url = atom({
  key: "Url", // unique ID (with respect to other atoms/selectors)
  default: import.meta.env.VITE_API_URL, // default value (aka initial value)
});
export default Url;
