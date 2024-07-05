import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [players, setPlayers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>(players);
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate();

  const getPlayers = async () => {
    try {
      const response = await api.get("player/");
      setPlayers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: any) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    const filteredItems = players.filter((user: any) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  };

  const func = (player: any) => {
    setSearch("");
    navigate(`/profile/${player.username}`);
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div id="search-bar">
      <div className="Search-input-container">
        <input
          id="search"
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleInputChange}
        />
        {search && (
          <div className="SearchUsers">
            {filteredUsers.length == 0 && <h1>No User Found</h1>}
            {filteredUsers.map((player: any) => (
              <h1 key={player.username} onClick={() => func(player)}>
                {player.username}
              </h1>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
