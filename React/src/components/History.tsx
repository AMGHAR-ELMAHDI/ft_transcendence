import React from "react";
import HistoryData from "../Data/HistoryData.json";

function History() {
  let Data = HistoryData;
  return (
    <div className="ProfileHistoryContainer">
      <div className="HistoryToolTip">
        <h1>Date</h1>
        <h1>Opponent</h1>
        <h1>Score</h1>
        <h1>Game Mode</h1>
        <h1>Lenght</h1>
      </div>
      <ul>
        {Data.History.map((element) => (
            <li>{element.GameMode}</li>
        ))}
      </ul>
      <div className="ProfileHistoryData">
      </div>
    </div>
  );
}

export default History;
