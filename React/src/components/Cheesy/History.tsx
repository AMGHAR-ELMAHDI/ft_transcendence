import React from "react";
import HistoryData from "../../Data/HistoryData.json";

function getScore(WholeStr: string) {
  let Str = WholeStr.split(":");

  return (
    <>
      <h1 className="UserScore">{Str[0]}</h1>
      <h1>&nbsp;{":"}&nbsp;</h1>
      <h1 className="OppScore">{Str[1]}</h1>
    </>
  );
}

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

function History() {
  let Data = HistoryData;
  return (
    <div className="tableau">
      <table>
        {getTooltip()}
        {Data.History.map((element) => (
          <tbody key={element.id + Math.random()}>
            <tr className={element.Result === "Won" ? "Won" : "Lost"}>
              <td className="leftTd zekton">
                <h1>{element.date}</h1>
              </td>
              <td className="Toruk">
                <h1>{element.username}</h1>
              </td>
              <td className="ScoreTd Toruk">{getScore(element.score)}</td>
              <td className="zekton">
                <h1>{element.GameMode}</h1>
              </td>
              <td className="rightTd zekton">
                <h1>{element.lenght}</h1>
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
    </div>
  );
}

export default History;
