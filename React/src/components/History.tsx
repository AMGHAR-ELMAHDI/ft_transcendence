import React from "react";
import HistoryData from "../Data/HistoryData.json";

function getScore(WholeStr: string) {
  let Str = WholeStr.split(":");

  return (
    <>
      <h1 className="UserScore">{Str[0] + " :"}</h1>
      <h1 className="OppScore">&nbsp;{Str[1]}</h1>
    </>
  );
}

function History() {
  let Data = HistoryData;
  return (
    <div className="tableau">
      <table>
        <tr className="HistoryToolTipTable">
          <th><h1>DATE</h1></th>
          <th><h1>OPPONENT</h1></th>
          <th><h1>SCORE</h1></th>
          <th><h1>GAME MODE</h1></th>
          <th><h1>LENGTH</h1></th>
        </tr>
        <div className="spacing"></div>
        {Data.History.map((element) => (
          <>
            <tr
              key={element.id}
              className={element.Result === "Won" ? "Won" : "Lost"}
            >
              <td className="leftTd"><h1>{element.date}</h1></td>
              <td><h1>{element.username}</h1></td>
              <td className="ScoreTd">{getScore(element.score)}</td>
              <td><h1>{element.GameMode}</h1></td>
              <td className="rightTd"><h1>{element.lenght}</h1></td>
            </tr>
            <div className="spacing"></div>
          </>
        ))}
      </table>
    </div>
  );
}

export default History;
