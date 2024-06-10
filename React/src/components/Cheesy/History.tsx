import { useEffect, useState } from "react";
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

function getHistoryTabs(player_score: number, opponent_score: number) {
  if (player_score >= opponent_score) return "Won";
  else return "Lost";
}

function History({ UserData, UseUserData }: UserDataProps) {
  const [render, setRender] = useState(screen.width >= 1024 ? true : false);
  // const [data, setData] = useState<any>([]);
  // const [isLoading, setLoading] = useState(true);

  // let url;
  // if (!UseUserData) url = "player/games/";
  // else url = `player/${UserData?.username}/games/`;

  // const getData = async () => {
  //   try {
  //     const response = await api.get(url);
  //     setData(response.data?.games);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  const obj = [
    {
      id: 1,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 10.0,
      opponent_score: 5.0,
      opponent_username: "dawdaw",
      game_mode: "O",
      game_duration_minutes: 5.0,
    },
    {
      id: 2,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 13.0,
      opponent_score: 27.0,
      opponent_username: "dawdaw",
      game_mode: "B",
      game_duration_minutes: 5.0,
    },
    {
      id: 3,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 15.0,
      opponent_score: 25.0,
      opponent_username: "dawdaw",

      game_mode: "T",
      game_duration_minutes: 5.0,
    },
    {
      id: 4,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 17.0,
      opponent_score: 16.0,
      opponent_username: "dawdaw",

      game_mode: "O",
      game_duration_minutes: 5.0,
    },
    {
      id: 5,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 15.0,
      opponent_score: 20.0,
      opponent_username: "dawdaw",

      game_mode: "O",
      game_duration_minutes: 5.0,
    },
    {
      id: 6,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 11.0,
      opponent_score: 11.0,
      opponent_username: "dawdaw",

      game_mode: "O",
      game_duration_minutes: 5.0,
    },
    {
      id: 7,
      date: "2024-05-11T16:35:58.852097Z",
      player: 1,
      opponent: 2,
      player_score: 8.0,
      opponent_score: 14.0,
      opponent_username: "dawdaw",
      game_mode: "O",
      game_duration_minutes: 5.0,
    },
  ];
  // const length: boolean = data?.length ? true : false;

  return (
    <div className="tableau">
      <table>
        {getTooltip()}
        {obj?.map((game: any) => (
          <tbody key={game?.id}>
            <tr
              className={getHistoryTabs(
                game?.player_score,
                game?.opponent_score
              )}
            >
              <td className="leftTd zekton">
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
              {/* {render && ( */}
              <td className="rightTd zekton DontRender">
                <h1>{game?.game_duration_minutes + "min"}</h1>
              </td>
              {/* )} */}
            </tr>
            <tr>
              <td>
                <div className="spacing"></div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default History;
