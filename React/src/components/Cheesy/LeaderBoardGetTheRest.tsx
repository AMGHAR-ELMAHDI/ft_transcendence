import { useRecoilValue } from "recoil";
import LeaderData from "../../Atoms/LeaderData";
import { Link } from "react-router-dom";
import { GetCorrect } from "./LeaderBoardGetTop3";
import Url from "../../Atoms/Url";

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
            {/* <h1 className="TooltipRightWins ToolTipColor Panton">Games Won</h1> */}
            <h1 className="TooltipRightLevel ToolTipColor Panton">Level</h1>
          </div>
        </div>
      </div>
    </>
  );
}

function LeaderBoardGetTheRest() {
  const leaderBoardData = useRecoilValue(LeaderData);
  const url = useRecoilValue(Url);
  if (leaderBoardData.length <= 3) return <div />;

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
                <Link to={`/profile/${user.username}`}>
                  <img
                    className="RestImgs removeLeader"
                    src={GetCorrect(user.image, url)}
                    alt="userPic"
                  />
                </Link>
              </div>
              <div className="LeaderRestRight">
                <div className="LeaderRestRighUsrtName">
                  <Link to={`/profile/${user.username}`}>
                    <h1 className="Panton">{user.username}</h1>
                  </Link>
                </div>
                <div className="LeaderRestRightLvl">
                  {/* <h1 className="UserGamesWon Panton">{user.games_won}</h1> */}
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

export default LeaderBoardGetTheRest;
