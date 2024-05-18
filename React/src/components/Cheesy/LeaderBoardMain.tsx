import axios from "axios";
import { useEffect } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilState, useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import LeaderData from "../../Atoms/LeaderData";
import Url from "../../Atoms/Url";
import api from "../../api";

function getTop3() {
  const leaderBoardData = useRecoilValue(LeaderData);
  // const url = useRecoilValue(Url);

  if (leaderBoardData.length < 3) return <h1>There aren't Enough PLayers</h1>;

  const top3: any = leaderBoardData.slice(0, 3);

  return (
    <div className="Top3">
      <div className="First">
        <div className="topImgsContainer">
          <img
            className="topImgs"
            src={"http://localhost:2500/" + top3[0].image.substring(6)}
            alt={top3[0].username + "picture"}
          />
        </div>
        <h1 className="toph1 Panton">{top3[0].username}</h1>
      </div>
      <div className="SecondThird">
        <div className="Second">
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={"http://localhost:2500/" + top3[1].image.substring(6)}
              alt={top3[1].username + "picture"}
            />
          </div>
          <h1 className="toph1 Panton">{top3[1].username}</h1>
        </div>
        <div className="Third">
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={"http://localhost:2500/" + top3[2].image.substring(6)}
              alt={top3[2].username + "picture"}
            />
          </div>
          <h1 className="toph1 Panton">{top3[2].username}</h1>
        </div>
      </div>
    </div>
  );
}

function getToolTip() {
  return (
    <>
      <div className="LeaderBoardToolTip">
        <div className="TooltipLeft">
          <div className="TooltipLeftRank">
            <h1 className="ToolTipColor Panton">Rank</h1>
            <div />
          </div>
          <div />
        </div>
        <div className="TooltipRight">
          <div className="TooltipRightUser">
            <h1 className="ToolTipColor Panton">UserName</h1>
          </div>
          <div className="TooltipRightRest">
            <h1 className="TooltipRightWins ToolTipColor Panton">Games Won</h1>
            <h1 className="TooltipRightLevel ToolTipColor Panton">Level</h1>
          </div>
        </div>
      </div>
    </>
  );
}

function getTheRest() {
  const leaderBoardData = useRecoilValue(LeaderData);
  if (leaderBoardData.length <= 3) return <div />;
  // const url = useRecoilValue(Url);

  const rest: any = leaderBoardData.slice(3);
  return (
    <>
      {getToolTip()}
      <div className="LeaderBoardRest">
        <ul>
          {rest.map((user: any, index: number) => (
            <li
              key={user.username}
              className={(index + 3) % 2 == 0 ? "SpecialCase" : ""}
            >
              <div className="LeaderRestLeft">
                <div className="idAndLine">
                  <h1 className="Panton">{index + 3}</h1>
                  <div className="lineLi" />
                </div>
                <img
                  className="RestImgs"
                  src={"http://localhost:2500/" + user.image.substring(6)}
                  alt="userPic"
                />
              </div>
              <div className="LeaderRestRight">
                <div className="LeaderRestRighUsrtName">
                  <Link to={"/profile"}>
                    <h1 className="Panton">{user.username}</h1>
                  </Link>
                </div>
                <div className="LeaderRestRightLvl">
                  <h1 className="UserGamesWon Panton">{user.games_won}</h1>
                  <h1 className="UserLevel Panton">{user.level}</h1>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function LeaderBoardMain() {
  const [data, setData] = useRecoilState(LeaderData);
  // const url = useRecoilValue(Url);

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
      {getTop3()}
      {getTheRest()}
    </div>
  );
}

export default LeaderBoardMain;
