import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Url from "../../Atoms/Url";
import { useRecoilValue } from "recoil";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";
import Typed from "typed.js";
import { Friend } from "../Otchekai/Chat/ChatFriends";

function getFriendStatus(string: any) {
  if (string === "F") return "Offline";
  return "Online";
}

function getProfileToolTip() {
  return (
    <thead>
      <tr className="ProfileFriendsToolTip">
        <th className="removeit">
          <h1>PICTURE</h1>
        </th>
        <th>
          <h1>USERNAME</h1>
        </th>
        <th className="remove">
          <h1>LEVEL</h1>
        </th>
        <th className="remove">
          <h1>COINS</h1>
        </th>
        <th>
          <h1>STATUS</h1>
        </th>
      </tr>
    </thead>
  );
}

function ProfileFriends() {
  const [data, setData] = useState<Friend[]>([]);
  const url = useRecoilValue(Url);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      setData(response.data.friends);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const token = localStorage.getItem("token");
    const socket = new WebSocket(
      `wss://${import.meta.env.VITE_WS_URL}ws/status/${token}/${1}`
    );
    socket.onopen = () => {};
    socket.onmessage = (event) => {
      getData();
    };
    socket.onclose = () => {};
    socket.onerror = (error) => {
    };

    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["Empty Friends List !!", "Why so lonely? (:"],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
        showCursor: false,
      });

      return () => {
        socket.close();

        typed.destroy();
      };
    }
  }, []);

  const length: boolean = data?.length ? true : false;
  if (!data?.length)
    return (
      <div className="textContainer">
        <h1 className="emptyData"></h1>
      </div>
    );

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div id="ProfileFriendsContainer">
          <table>
            {getProfileToolTip()}
            {data.map((friend: Friend) => (
              <tbody key={friend.id}>
                <tr className="ProfileFriendsContent">
                  <td className="removeit">
                    <div>
                      <img
                        className="ProfileFriendImg"
                        src={GetCorrect(friend.avatar, url)}
                        onClick={() => {
                          navigate(`/profile/${friend.username}`);
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <h1
                      className="ProfileFriendUsername ProfileFriendH1"
                      onClick={() => navigate(`/profile/${friend.username}`)}
                    >
                      {friend.username}
                    </h1>
                  </td>
                  <td className="remove">
                    <h1 className="ProfileFriendLevel ProfileFriendH1">
                      {friend.level}
                    </h1>
                  </td>
                  <td className="remove">
                    <h1 className="ProfileFriendCoins ProfileFriendH1">
                      {friend.level}
                    </h1>
                  </td>
                  <td>
                    <h1 className="ProfileFriendStatus ProfileFriendH1">
                      {getFriendStatus(friend.status)}
                    </h1>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
    </>
  );
}

export default ProfileFriends;
