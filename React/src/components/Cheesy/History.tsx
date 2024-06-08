import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import LoadingData from "./LoadingData";
import { UserDataProps } from "./ProfileItems";

function getTooltip() {
  return (
    <>
      <thead>
        <tr className="HistoryToolTipTable">
          <th>
            <h1>DATE</h1>
          </th>
          <th>
            <h1>OPPONENT</h1>
          </th>
          <th>
            <h1>SCORE</h1>
          </th>
          <th>
            <h1>GAME MODE</h1>
          </th>
          <th>
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

function getHistoryTabs(player_score: number, opponent_score: number) {
  if (player_score >= opponent_score) return "Won";
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
      setData(response.data?.games);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const length: boolean = data?.length ? true : false;

  return (
    <div className="tableau">
      {isLoading && LoadingData()}
      {!isLoading && !length ? (
        <div className="ProfileItems">
          <h1 className="emptyData">No Games History</h1>
        </div>
      ) : (
        <table>
          {getTooltip()}
          {data?.map((game: any) => (
            <tbody key={game.id}>
              <tr
                className={getHistoryTabs(
                  game.player_score,
                  game.opponent_score
                )}
              >
                <td className="leftTd zekton">
                  <h1>{getDate(game?.date)}</h1>
                </td>
                <td className="Toruk">
                  <h1>{game?.opponent_username[0]?.username}</h1>
                </td>
                <td className="ScoreTd Toruk">
                  {getScore(game.player_score, game.opponent_score)}
                </td>
                <td className="zekton">
                  <h1>{getGameMode(game?.game_mode)}</h1>
                </td>
                <td className="rightTd zekton">
                  <h1>{game.game_duration_minutes + "min"}</h1>
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
