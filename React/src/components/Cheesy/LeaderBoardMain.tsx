import axios from "axios";
import Data from "../../Data/LeaderBoardData.json";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setAuthToken } from "../Utils/setAuthToken";

function getTop3() {
  const LeaderBoardData = Data;
  return (
    <div className="Top3">
      <div className="First">
        <div className="topImgsContainer">
          <img
            className="topImgs"
            src={LeaderBoardData.LeaderBoard[0].picture}
          />
        </div>
        <h1 className="toph1 Panton">
          {LeaderBoardData.LeaderBoard[0].username}
        </h1>
      </div>
      <div className="SecondThird">
        <div className="Second">
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={LeaderBoardData.LeaderBoard[1].picture}
            />
          </div>
          <h1 className="toph1 Panton">
            {LeaderBoardData.LeaderBoard[1].username}
          </h1>
        </div>
        <div className="Third">
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={LeaderBoardData.LeaderBoard[2].picture}
            />
          </div>
          <h1 className="toph1 Panton">
            {LeaderBoardData.LeaderBoard[2].username}
          </h1>
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
  const LeaderBoardData = Data;
  return (
    <>
      {getToolTip()}
      <div className="LeaderBoardRest">
        <ul>
          {LeaderBoardData.LeaderBoard.map(
            (user) =>
              user.id > 3 && (
                <li
                  key={user.id}
                  id={user.id.toString()}
                  className={user.id % 2 == 0 ? "SpecialCase" : ""}
                >
                  <div className="LeaderRestLeft">
                    <div className="idAndLine">
                      <h1 className="Panton">{user.id}</h1>
                      <div className="lineLi" />
                    </div>
                    <img
                      className="RestImgs"
                      src={user.picture}
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
              )
          )}
        </ul>
      </div>
    </>
  );
}

function LeaderBoardMain() {
  let data: any = getLeaderBoardData();
  console.log("data: " + data);

  const obj = {
    username: data.username ? data.username : "Dawdaw",
    first_name: data.first_name ? data.first_name : "First",
    last_name: data.last_name ? data.last_name : " Last",
    image: data.image ? data.image : "/bacharG.svg",
    level: data.level ? data.level : 0,
    coins: data.coins ? data.coins : 0,
    Games_Won: data.Games_Won ? data.Games_Won : 0,
  };
  return (
    <div className="LeaderBoardContainer">
      <h1>LEADERBOARD</h1>
      {getTop3()}
      {getTheRest()}
    </div>
  );
}

export default LeaderBoardMain;

export function getLeaderBoardData() {
  let data: any = {};
  setAuthToken();
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2500/player/leaderboard/"
      );
      data = response;
      console.log("Leader Data:" + response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return data;
}
