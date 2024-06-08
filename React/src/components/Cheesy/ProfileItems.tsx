import { useEffect } from "react";
import { useState } from "react";
import api from "../../api";
import LoadingData from "./LoadingData";
import ShopCard, { ShopProps } from "./ShopCard";

export interface UserDataProps {
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
  };
  UseUserData: boolean;
}

function ProfileItems({ UserData, UseUserData }: UserDataProps) {
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

  const length: boolean = data?.length ? true : false;

  return (
    <>
      {isLoading && LoadingData()}
      {!isLoading && !length ? (
        <div className="ProfileItems">
          <h1 className="emptyData">No Items</h1>
        </div>
      ) : (
        !isLoading &&
        length && (
          <div className="ProfileItems">
            {data?.map((item: ShopProps) => (
              <ShopCard key={item.id} {...item} />
            ))}
          </div>
        )
      )}
    </>
  );
}

export default ProfileItems;
