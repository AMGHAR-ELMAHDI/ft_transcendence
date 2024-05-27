import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Url from "../../Atoms/Url";
import { useRecoilValue } from "recoil";
import { PiChatCircleDotsBold } from "react-icons/pi";
import GetCorrectImage from "./GetCorrectImage";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";

function getFriendStatus() {
  return "Online";
}

function getProfileToolTip() {
  return (
    <thead>
      <tr className="ProfileFriendsToolTip">
        <th>
          <h1>PICTURE</h1>
        </th>
        <th>
          <h1>USERNAME</h1>
        </th>
        <th>
          <h1>LEVEL</h1>
        </th>
        <th>
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
  const [data, setData] = useState<any>([]);
  const url = useRecoilValue(Url);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const getData = async () => {
    try {
      const response = await api.get("player/friends/");
      setData(response.data.friends);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (data?.length == 0) return <h1>{"You Don't Have Any Friends :("}</h1>;

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div id="ProfileFriendsContainer">
          <table>
            {getProfileToolTip()}
            {data.map((friend: any) => (
              <tbody key={friend?.id}>
                <tr className="ProfileFriendsContent">
                  <td>
                    <div>
                      <img
                        className="ProfileFriendImg"
                        src={GetCorrect(friend?.avatar, url)}
                        onClick={() => {
                          navigate(`/profile/${friend?.username}`);
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <h1
                      className="ProfileFriendUsername ProfileFriendH1"
                      onClick={() => navigate(`/profile/${friend?.username}`)}
                    >
                      {friend?.username}
                    </h1>
                  </td>
                  <td>
                    <h1 className="ProfileFriendLevel ProfileFriendH1">
                      {friend?.level}
                    </h1>
                  </td>
                  <td>
                    <h1 className="ProfileFriendCoins ProfileFriendH1">
                      {friend?.coins}
                    </h1>
                  </td>
                  <td>
                    <h1 className="ProfileFriendStatus ProfileFriendH1">
                      {getFriendStatus()}
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

// {
//     "id": 2,
//     "username": "user2",
//     "first_name": "",
//     "last_name": "",
//     "avatar": "media/store/images/default.png",
//     "level": 5680,
//     "coins": 1000
// },
