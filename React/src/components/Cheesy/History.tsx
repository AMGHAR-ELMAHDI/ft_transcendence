import { useEffect, useState } from "react";
import api from "../../api";
import LoadingData from "./LoadingData";
import { UserDataProps } from "./ProfileItems";
import Typed from "typed.js";

function getTooltip() {
  return (
    <>
      <thead>
        <tr className="HistoryToolTipTable">
          <th className="DontRenderF">
            <h1>DATE</h1>
          </th>
          <th>
            <h1>OPPONENT</h1>
          </th>
          <th>
            <h1>SCORE</h1>
          </th>
          <th>
            <h1>MODE</h1>
          </th>
          <th className="DontRender">
            <h1>LENGTH</h1>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="spacing"></div>
          </td>
        </tr>
      </tbody>
    </>
  );
}

function getDate(date: string) {
  const flipedDate = date.substring(0, 10).split("-").reverse();
  return flipedDate[0] + "-" + flipedDate[1] + "-" + flipedDate[2];
}

function getGameMode(mode: string) {
  if (mode === "O") return "Classic";
  else if (mode === "T") return "Tournament";
  else if (mode === "B") return "Bot";
}

function getScore(player_score: string, opponent_score: string) {
  return (
    <div className="Dashboard-History-Score">
      <h3 id="PlayerScoreProfile">{player_score}</h3>
      <h3>&nbsp; : &nbsp;</h3>
      <h3 id="PlayerScoreOpponent">{opponent_score}</h3>
    </div>
  );
}

function getHistoryTabs(id: string, winner: string) {
  if (id === winner) return "Won";
  else return "Lost";
}

function History({ UserData, UseUserData }: UserDataProps) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

  let url;
  if (!UseUserData) url = "player/games/";
  else url = `player/${UserData?.username}/games/`;

  const getData = async () => {
    try {
      const response = await api.get(url);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["Empty Game History!!", "Play Some Games To Fill This!!"],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
        showCursor: false,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  const length: boolean = data?.length ? true : false;
  let element: any = document.querySelector(".tableau");
  if (element && !length) element.style.overflow = "hidden";

  if (!length)
    return (
      <div className="textContainer">
        <h1 className="emptyData"></h1>
      </div>
    );

  return (
    <div className="tableau">
      {isLoading ? (
        LoadingData()
      ) : (
        <table>
          {getTooltip()}
          {data?.map((game: any) => (
            <tbody key={game?.id}>
              <tr className={getHistoryTabs(game?.player_id, game?.winner_id)}>
                <td className="leftTd zekton DontRenderF">
                  <h1>{getDate(game?.date)}</h1>
                </td>
                <td className="Toruk">
                  <h1>{game?.opponent_username}</h1>
                </td>
                <td className="ScoreTd Toruk">
                  {getScore(game?.player_score, game?.opponent_score)}
                </td>
                <td className="zekton Render">
                  <h1>{getGameMode(game?.game_mode)}</h1>
                </td>
                <td className="rightTd zekton DontRender">
                  <h1>{game?.game_duration}</h1>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="spacing"></div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
    </div>
  );
}

export default History;
