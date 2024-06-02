import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import { Link, useNavigate } from "react-router-dom";
import Notif from "../Cheesy/Notif";
import api from "../../api";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { GetCorrect } from "../Cheesy/LeaderBoardGetTop3";
import LoadingData from "../Cheesy/LoadingData";

export function getPageName() {
  let pageName = window.location.pathname;

  if (window.location.pathname?.includes("/profile/")) return "User Profile";
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

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

function TopBar() {
  const [data, setData] = React.useState<any>({});
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);
  const [search, setSearch] = useState<string>("");
  const [players, setPlayers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>(players);
  const [isFocused, setIsFocused] = useState(false);
  const url = useRecoilValue(Url);
  const [isLoading, setIsLoading] = useState(true);

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

  const getData = async () => {
    try {
      const response = await api.get("player/me");
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getPlayers = async () => {
    try {
      const response = await api.get("player/");
      setPlayers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const obj = {
    username: data.username,
    id: data.id,
    avatar: data.avatar,
    friends: data.friends ? data.friends : [0],
    level: data.level,
  };

  useEffect(() => {
    getData();
    getPlayers();
  }, []);
  const navigate = useNavigate();

  let print = <h1>Good Evening,</h1>;
  let username = <h1 id="nickName">{obj.username}</h1>;
  return (
    <>
      {isLoading && LoadingData()}
      <div id="TopBar">
        <div id="welcome-bar">
          {window.location.pathname === "/" && print}
          {window.location.pathname === "/" && username}
          {window.location.pathname !== "/" && (
            <h1 id="nickName">{getPageName()}</h1>
          )}
        </div>

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
              <img
                className="NotifProfilePic"
                src={GetCorrect(obj.avatar, url)}
              />
              {isDropdownVisible && <DropdownMenu />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopBar;
