import axios from "axios";
import Data from "../../Data/LeaderBoardData.json";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function getTop3() {
  const LeaderBoardData = Data;
  return (
    <div className="Top3">
      <div className="First">
        <div className="topImgsContainer">
          <img className="topImgs" src={LeaderBoardData.LeaderBoard[0].picture} />
        </div>
        <h1 className="toph1 Panton">{LeaderBoardData.LeaderBoard[0].username}</h1>
      </div>
      <div className="SecondThird">
        <div className="Second">
          <div className="topImgsContainer">
            <img className="topImgs" src={LeaderBoardData.LeaderBoard[1].picture}/>
          </div>
          <h1 className="toph1 Panton">{LeaderBoardData.LeaderBoard[1].username}</h1>
        </div>
        <div className="Third">
          <div className="topImgsContainer">
            <img className="topImgs" src={LeaderBoardData.LeaderBoard[2].picture}/>
          </div>
          <h1 className="toph1 Panton">{LeaderBoardData.LeaderBoard[2].username}</h1>
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
                <li key={user.id} id={user.id.toString()} className={user.id % 2 == 0 ? "SpecialCase" : ""}>
                  <div className="LeaderRestLeft">
                    <div className="idAndLine">
                      <h1 className="Panton">{user.id}</h1>
                      <div className="lineLi" />
                    </div>
                    <img className="RestImgs" src={user.picture} alt="userPic"/>
                  </div>
                  <div className="LeaderRestRight">
                    <div className="LeaderRestRighUsrtName">
                      <Link  to={"/profile"}><h1 className="Panton">{user.username}</h1></Link>
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
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/get/")
  //     .then((response) => {
  //       if (response.status === 200) {
  //         const LeaderBoard = JSON.parse(response.data);
  //         console.log(LeaderBoard[0]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });
  return (
    <div className="LeaderBoardContainer">
      <h1>LEADERBOARD</h1>
      {getTop3()}
      {getTheRest()}
    </div>
  );
}

export default LeaderBoardMain;
