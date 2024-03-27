import React from "react";

function Circle() {
  return (
    <svg id="progress-circle-thingy"
      width="300"
      height="300"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="-rotate-90"
    >
      <circle
        cx="50"
        cy="50"
        strokeWidth={4}
        r="48"
        fill="transparent"
        stroke="#5FCAE4"
      />
      <circle
        cx="50"
        cy="50"
        strokeWidth={4}
        r="48"
        fill="transparent"
        stroke="#5FCAE4"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - 100}
      />
    </svg>
  );
}

export default Circle;
