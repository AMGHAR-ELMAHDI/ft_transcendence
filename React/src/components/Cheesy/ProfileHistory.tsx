import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import LoadingData from "./LoadingData";

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
      <h3 id="History-player_score">{player_score}</h3>
      <h3>&nbsp; : &nbsp;</h3>
      <h3 id="History-opponent_score">{opponent_score}</h3>
    </div>
  );
}

function getHistoryTabs(player_score: number, opponent_score: number) {
  if (player_score >= opponent_score) return "history-tabs history-tab-won";
  else return "history-tabs history-tab-lost";
}

function getHistoryRect(player_score: number, opponent_score: number) {
  if (player_score >= opponent_score)
    return "dashboard-history-right-rect rect-won";
  else return "dashboard-history-right-rect rect-lost";
}

function ProfileHistory() {
  const [data, setData] = useState<any>([]);
  const url = useRecoilValue(Url);
  const [isLoading, setIsLoading] = useState(true);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/games/");
      setData(response.data.games);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data.length) {
    return (
      <div id="HistoryNogamesPlayed">
        <h1>No Games Played</h1>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div id="history">
          <div id="tabs-container">
            {data.map((game: any) => {
              return (
                <div
                  key={game.id}
                  className={getHistoryTabs(
                    game.player_score,
                    game.opponent_score
                  )}
                >
                  <div className="history-tabs-left-container">
                    <div id="dashboard-history-opponent">
                      <h3>{game?.opponent_username[0]?.username}</h3>
                    </div>
                    {getScore(game.player_score, game.opponent_score)}
                    <div id="dashboard-history-mode">
                      <h3>{getGameMode(game?.game_mode)}</h3>
                    </div>
                    <div id="dashboard-history-date">
                      <h3>{getDate(game?.date)}</h3>
                    </div>
                  </div>
                  <div
                    className={getHistoryRect(
                      game.player_score,
                      game.opponent_score
                    )}
                  ></div>
                </div>
              );
            })}
          </div>
          {/* {window.location.pathname === "/profile" && (
        <div className="HistoryShadow"></div>
      )}
      {window.location.pathname === "/" && (
        <div className="HistoryShadowDashboard"></div>
      )} */}
        </div>
      )}
    </>
  );
}

export default ProfileHistory;
