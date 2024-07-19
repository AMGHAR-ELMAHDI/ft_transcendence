import toast from "react-hot-toast";
import api from "../../api";

export interface Props {
  id: number;
  type: string;
  name: string;
  price: number;
  path: string;
  change: string;
  email: string;
  ball: string;
  paddle: string;
  table: string;
}

function SettingsCard({
  id,
  name,
  path,
  price,
  type,
  change,
  email,
  ball,
  paddle,
  table,
}: Props) {
  const equipItem = async () => {
    const obj = {
      email: email,
      ball: change == "B" ? id : Number(ball),
      table: change == "G" ? id : Number(table),
      paddle: change == "P" ? id : Number(paddle),
    };

    console.log("email: " + JSON.stringify(obj));
    try {
      await api.put("player/set/", obj);
      toast.success("Item equipped", { id: String(id) });
    } catch (error) {
      console.log(error);
      toast.error("Failed to equip item");
    }
  };

  // if (price == 0) return;

  return (
    <div className="SettingCardContainer" onClick={equipItem}>
      <img src={path} alt={name} />
      <h1>{name}</h1>
    </div>
  );
}

export default SettingsCard;
