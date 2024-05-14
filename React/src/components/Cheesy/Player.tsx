import axios from "axios";
import { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";

function Player() {
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState("");

  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2500/search/${search}`
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search) getData();
  }, []);
  console.log("search: " + search);

  return (
    <div>
      <input
        className="GeneralInfoInput"
        type="text"
        name="username"
        value={search}
        onChange={(e) => (getData(), setSearch(e.target.value))}
      />
    </div>
  );
}

export default Player;
