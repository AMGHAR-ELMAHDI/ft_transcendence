import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { GetCorrect } from "../Cheesy/LeaderBoardGetTop3";
import Notif from "../Cheesy/Notif";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const DropdownMenu = () => {
  return (
    <div className="dropdown-menu">
      <ul>
        <li>
          <Link to={"/profile"}> Profile</Link>
        </li>
        <li>
          <Link to={"/settings"}> Settings</Link>
        </li>
      </ul>
    </div>
  );
};

interface obj {
  username: string;
  id: number;
  avatar: string;
  friends: any[];
  level: number;
}

function SearchBar(obj: obj) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [players, setPlayers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>(players);
  const [search, setSearch] = useState<string>("");
  const url = useRecoilValue(Url);

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
      <div
        className="Search-input-container"
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <input
          id="search"
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleInputChange}
        />
        {search && isFocused && (
          <div className="SearchUsers" onClick={() => setIsFocused(false)}>
            {filteredUsers.length == 0 && <h1>No User Found</h1>}
            {filteredUsers.map((player: any) => (
              <h1 key={player.username} onClick={() => func(player)}>
                {player.username}
              </h1>
            ))}
          </div>
        )}
      </div>
      <div className="NotifProfile">
        {<Notif />}
        <div
          className="div-relat"
          onMouseEnter={() => setDropdownVisible(true)}
          onClick={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <img className="NotifProfilePic" src={GetCorrect(obj.avatar, url)} />
          {isDropdownVisible && <DropdownMenu />}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
