import { useEffect } from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import api from "../../api";
import LoadingData from "./LoadingData";
import ShopCard, { ShopProps } from "./ShopCard";

interface HistoryProps {
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

function ProfileItems({ UserData, UseUserData }: HistoryProps) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  let getUrl: string;
  if (!UseUserData) getUrl = "player/items/";
  else getUrl = `player/${UserData?.username}/items/`;

  const getData = async () => {
    try {
      const response = await api.get(getUrl);
      if (!UseUserData) setData(response.data?.items);
      else setData(response.data);
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
        <h1 className="emptyData">No Items</h1>
      </div>
    );

  return (
    <>
      {isLoading && LoadingData()}
      {!isLoading && (
        <div className="ProfileItems">
          {data?.map((item: ShopProps) => (
            <ShopCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProfileItems;
