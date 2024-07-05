import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

function GetCircles(person: { win_rate: number; achievements_rate: number }) {
  let font_Size = 50;
  let font_Size_Names = 30;
  if (window.innerWidth <= 2560) {
    font_Size = 35;
    font_Size_Names = 25;
  }

  return (
    <div id="circles">
      <CircularProgressbarWithChildren
        value={person.win_rate}
        styles={buildStyles({
          pathColor: `rgba(95, 202, 228, 1)`,
          textColor: "#FFFFFF",
          trailColor: "#323644",
          backgroundColor: "#3e98c7",
        })}
      >
        <div
          style={{
            fontSize: font_Size_Names,
            color: "#B2B2B2",
            marginTop: -20,
          }}
        >
          Win Rate
        </div>
        <div style={{ fontSize: font_Size }}>{person.win_rate}%</div>
      </CircularProgressbarWithChildren>
      <CircularProgressbarWithChildren
        value={person.achievements_rate}
        styles={buildStyles({
          pathColor: `rgba(95, 202, 228, 1)`,
          textColor: "#FFFFFF",
          trailColor: "#323644",
          backgroundColor: "#3e98c7",
        })}
      >
        <div
          style={{
            fontSize: font_Size_Names,
            color: "#B2B2B2",
            marginTop: -20,
          }}
        >
          Trophies
        </div>
        <div style={{ fontSize: font_Size }}>{person.achievements_rate}%</div>
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default GetCircles;
