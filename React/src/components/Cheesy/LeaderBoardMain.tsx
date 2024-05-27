import { useEffect } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilState } from "recoil";
import LeaderData from "../../Atoms/LeaderData";
import api from "../../api";
import LeaderBoardGetTop3 from "./LeaderBoardGetTop3";
import LeaderBoardGetTheRest from "./LeaderBoardGetTheRest";

function LeaderBoardMain() {
  const [data, setData] = useRecoilState(LeaderData);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/leaderboard");
      setData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="LeaderBoardContainer">
      <LeaderBoardGetTop3 />
      <LeaderBoardGetTheRest />
    </div>
  );
}

export default LeaderBoardMain;
