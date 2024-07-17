import { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import api from "../../api";
import LoadingData from "./LoadingData";
import Typed from "typed.js";

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
      <h3 id="History-opponent_score">{opponent_score }</h3>
      <h3>&nbsp; : &nbsp;</h3>
      <h3 id="History-player_score">{player_score}</h3>
    </div>
  );
}

function getHistoryTabs(id:string, winner:string) {
  console.log("id: " + id);
  console.log("winner: " + winner);
  
  if (id === winner) return "history-tabs history-tab-won";
  else return "history-tabs history-tab-lost";
}

function getHistoryRect(player_score: number, opponent_score: number) {
  if (player_score >= opponent_score)
    return "dashboard-history-right-rect rect-won";
  else return "dashboard-history-right-rect rect-lost";
}

function ProfileHistory() {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/games/");
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const emptyDataElement = document.querySelector(".nogamess");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["Empty Game History!!"],
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

  // "id": 1,
  // "date": "2024-07-16T14:44:58.426835Z",
  // "player_id": 1,
  // "opponent_username": "user1",
  // "player_score": 6.0,
  // "opponent_score": 7.0,
  // "winner_id": 2,
  // "opponent_avatar": "images/default.png",
  // "game_mode": "O",
  // "game_duration": 10.11


  
  if (!data?.length) {
    return (
      <div id="HistoryNogamesPlayed">
        <h1 className="nogamess"></h1>
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
                    game?.player_id,
                    game?.winner_id
                  )}
                >
                  <div className="history-tabs-left-container">
                    <div id="dashboard-history-opponent">
                      <h3>{game?.opponent_username}</h3>
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
        </div>
      )}
    </>
  );
}

export default ProfileHistory;
