import axios from "axios";
import { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";

function searchPlayer(search: string) {}

function Player() {
  const [search, setSearch] = useState<string>("");
  const [players, setPlayers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>(players);
  const url = useRecoilValue(Url);

  const handleInputChange = (e: any) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    const filteredItems = players.filter((user: any) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  };

  setAuthToken();
  const getPlayers = async () => {
    try {
      const response = await api.get("player/");
      // console.log(response.data);
      setPlayers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div>
      <input
        className="GeneralInfoInput"
        type="text"
        value={search}
        onChange={handleInputChange}
      />
      {search && (
        <div className="SearchUsers">
          {filteredUsers.map((player: any) => (
            <h1 key={player.username}>{player.username}</h1>
          ))}
        </div>
      )}
    </div>
  );
}

export default Player;
