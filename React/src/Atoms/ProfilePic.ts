import { atom } from "recoil";

const ProfilePic = atom({
  key: "ProfilePic", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export default ProfilePic;
