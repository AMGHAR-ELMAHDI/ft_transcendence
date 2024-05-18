import { atom } from "recoil";

const OwnedItems = atom({
  key: "OwnedItems", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default OwnedItems;
