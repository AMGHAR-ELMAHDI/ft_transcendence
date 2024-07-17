import toast from "react-hot-toast";
import api from "../../api";

export interface Props {
  id: number;
  type: string;
  name: string;
  price: string;
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
    try {
      await api.put("player/set/", {
        email: email,
        ball: change == "B" ? id : ball,
        table: change == "G" ? id : table,
        paddle: change == "P" ? id : paddle,
        type: type,
      });
      toast.success("Item equipped", { id: String(id) });
    } catch (error) {
      console.log(error);
      toast.error("Failed to equip item");
    }
  };

  return (
    <div className="SettingCardContainer" onClick={equipItem}>
      <img src={path} alt={name} />
      <h1>{name}</h1>
    </div>
  );
}

export default SettingsCard;
