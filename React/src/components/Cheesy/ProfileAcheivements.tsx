import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import api from "../../api";
import AcheivementCard from "./AcheivementCard";
import LoadingData from "./LoadingData";

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

export interface CardProps {
  id: number;
  title: string;
  desc: string;
  path: string;
  Obtaining_date: string;
}

function ProfileAcheivements({ UserData, UseUserData }: Props) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  let url;
  if (!UseUserData) url = "player/achievements/";
  else url = `player/${UserData?.username}/achievements/`;

  const getData = async () => {
    try {
      const response = await api.get(url);
      setData(response.data?.achievements);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data?.length)
    return (
      <div className="ProfileItems">
        <h1 className="emptyData">No Trophies</h1>
      </div>
    );

  return (
    <>
      {isLoading ? (
        LoadingData()
      ) : (
        <div className="ProfileItems">
          {data?.map((Trophie: CardProps) => (
            <AcheivementCard key={Trophie.id} {...Trophie} />
          ))}
          {data?.map((Trophie: CardProps) => (
            <AcheivementCard key={Trophie.id} {...Trophie} />
          ))}
          {data?.map((Trophie: CardProps) => (
            <AcheivementCard key={Trophie.id} {...Trophie} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProfileAcheivements;
