import React, { useEffect } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";

interface Props {
  UserData?: {
    username: string;
    first_name: string;
    last_name: string;
    image: string;
    level: number;
    coins: number;
    email: string;
    win_rate: number;
    achievements_rate: number;
    games: [];
    items: [];
    acheivments: [];
  };
  UseUserData: boolean;
}

function ProfileAcheivements({ UserData, UseUserData }: Props) {
  const [data, setData] = React.useState<any>([]);
  const url = useRecoilValue(Url);

  console.log("herrrrereere");

  const username = UserData?.username;
  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("player/" + username + "/achievements/");
      // console.log(response.data?.items);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (UseUserData == false) getData();
    getData();
  }, []);

  return <div className="ProfileItems"></div>;
}

export default ProfileAcheivements;
