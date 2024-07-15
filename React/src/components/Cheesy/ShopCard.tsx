import { useState } from "react";

export interface ShopProps {
  id: number;
  type: string;
  name: string;
  price: number;
  path: string;
  purchase_date: string;
}

function ShopCard({ type, name, path, price, purchase_date }: ShopProps) {
  const [showDate, setShowDate] = useState<boolean>(false);
  const date = purchase_date.split("T")[0];


  return (
    <div
      className="ProfileItem"
      onMouseEnter={() => setShowDate(true)}
      onMouseLeave={() => setShowDate(false)}
    >
      <img src={path} alt={name} />
      <div className="ProfileItemInfo">
        <h2>{name}</h2>
        <h2>{price + "$"}</h2>
        {showDate && <h2 id="AchDate">{date}</h2>}
      </div>
    </div>
  );
}

export default ShopCard;
