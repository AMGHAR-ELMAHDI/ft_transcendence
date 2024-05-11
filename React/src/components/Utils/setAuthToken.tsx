import { useRecoilValue } from "recoil";
import AcessToken from "../../Atoms/AccessToken";
import axios from "axios";

export const setAuthToken = () => {
  // const token = useRecoilValue(AcessToken);
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
  } else delete axios.defaults.headers.common["Authorization"];
};
