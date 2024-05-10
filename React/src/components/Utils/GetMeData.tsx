import axios from "axios";
import { setAuthToken } from "../../components/Utils/setAuthToken";
import { useEffect } from "react";

const getMeData = async () => {
  try {
    setAuthToken();
    const response = await axios.get("http://localhost:2500/player/me");
    console.log("inside getmedata");
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getMeData };
