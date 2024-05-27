import { atom } from "recoil";

const ShopItems = atom({
  key: "ShopItems", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export default ShopItems;
