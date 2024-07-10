import { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilState } from "recoil";
import LeaderData from "../../Atoms/LeaderData";
import api from "../../api";
import LeaderBoardGetTop3 from "./LeaderBoardGetTop3";
import LeaderBoardGetTheRest from "./LeaderBoardGetTheRest";
import LoadingData from "./LoadingData";

function LeaderBoardMain() {
  const [data, setData] = useRecoilState(LeaderData);
  const [isLoading, setLoading] = useState(true);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/leaderboard");
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
    console.log(data);
  }, []);

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div className="LeaderBoardContainer">
          <LeaderBoardGetTop3 />
          <LeaderBoardGetTheRest />
        </div>
      )}
    </>
  );
}

export default LeaderBoardMain;
