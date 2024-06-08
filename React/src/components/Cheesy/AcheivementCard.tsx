import React, { useState } from "react";
import { CardProps } from "./ProfileAcheivements";

function AcheivementCard({ title, desc, path, Obtaining_date }: CardProps) {
  const [showDate, setShowDate] = useState<boolean>(false);
  const date = Obtaining_date.split("T")[0];
  return (
    <div
      className="ProfileItem"
      onMouseEnter={() => setShowDate(true)}
      onMouseLeave={() => setShowDate(false)}
    >
      <img
        src={
          "https://github.com/AMGHAR-ELMAHDI/GameHub/blob/main/Images/GameHubDesktop.png?raw=true"
        }
        alt={title}
      />
      <div className="ProfileItemInfo">
        <h2>{title}</h2>
        <p>{desc}</p>
        {showDate && <h2 id="AchDate">{date}</h2>}
      </div>
    </div>
  );
}

export default AcheivementCard;
