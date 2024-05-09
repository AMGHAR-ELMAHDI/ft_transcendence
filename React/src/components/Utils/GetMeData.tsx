import axios from "axios";
import { setAuthToken } from "../../components/Utils/setAuthToken";
import { useEffect } from "react";

export function getMeData() {
  let data: any = {};
  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/me");
      console.log(response.data);
      data = response.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return data;
}
