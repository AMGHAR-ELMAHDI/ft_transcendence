import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Url from "../../Atoms/Url";
import { useRecoilValue } from "recoil";
import { GetCorrect } from "./LeaderBoardGetTop3";
import LoadingData from "./LoadingData";

function getFriendStatus() {
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

  const length: boolean = data?.length ? true : false;

  return (
    <>
      {isLoading && LoadingData()}
      {!isLoading && !length ? (
        <div className="ProfileItems">
          <h1 className="emptyData">{"You Don't Have Any Friends :("}</h1>
        </div>
      ) : (
        <div id="ProfileFriendsContainer">
          <table>
            {getProfileToolTip()}
            {data.map((friend: any) => (
              <tbody key={friend?.id}>
                <tr className="ProfileFriendsContent">
                  <td className="removeit">
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
                  <td className="remove">
                    <h1 className="ProfileFriendLevel ProfileFriendH1">
                      {friend?.level}
                    </h1>
                  </td>
                  <td className="remove">
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
