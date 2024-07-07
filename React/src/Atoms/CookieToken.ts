import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
// import Cookies from "js-cookie";

const AcessToken = atom({
  key: "AcessToken", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default AcessToken;

// const { persistAtom } = recoilPersist({
//   key: "userData",
//   storage: {
//     getItem: (key: any) => Cookies.get(key),
//     setItem: (key: any, value: any) =>
//       Cookies.set(key, value, { expires: 7, path: "/" }),
//   },
// });

export const loggedUser = atom<number>({
  key: "loggedUser",
  default: -1,
  // effects_UNSTABLE: [persistAtom],
});
