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
      <ul className="ProfileHistoryData">
        {Data.History.map((element) => (
          <li key={element.id} className={element.Result === "Won" ? "Won" : "Lost"}>
            <h1>{element.date}</h1>
            <h1>{element.username}</h1>
            <h1>{element.score}</h1>
            <h1>{element.GameMode}</h1>
            <h1>{element.lenght}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
