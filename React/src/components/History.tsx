import React from "react";
import HistoryData from "../Data/HistoryData.json";

function getScore(WholeStr: string, num: number) {
  let Str = WholeStr.split(":");
  return Str[num];
}

function History() {
  let Data = HistoryData;
  let UserScore = 0;
  let OpponentScore = 0;
  return (
    <div className="tableau">
      <table>
        <tr className="HistoryToolTipTable">
          <th>Date</th>
          <th>Oppow nent</th>
          <th>Score</th>
          <th>Game Mode</th>
          <th>Length</th>
        </tr>
        <div className="spacing"></div>
        {Data.History.map((element) => (
          <>
            <tr
              key={element.id}
              className={element.Result === "Won" ? "Won" : "Lost"}
            >
              <td>{element.date}</td>
              <td>{element.username}</td>
              <td className="ScoreTd">
                <h1 className="UserScore">{getScore(element.score, 0)} : </h1>
                <h1 className="OppScore">{getScore(element.score, 1)}</h1>
              </td>
              <td>{element.GameMode}</td>
              <td>{element.lenght}</td>
            </tr>
            <div className="spacing"></div>
          </>
        ))}
      </table>
    </div>
  );
}

export default History;
