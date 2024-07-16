import toast from "react-hot-toast";
import api from "../../api";
import { SettingsProps } from "./ChangeItems";

function SettingsCard({ id, name, path, price, type }: SettingsProps) {
  const equipItem = async () => {
    try {
      const response = await api.put("player/items/", {
        item_id: id,
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
