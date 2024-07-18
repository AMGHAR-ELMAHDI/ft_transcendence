import { useEffect } from "react";
import { useState } from "react";
import api from "../../api";
import LoadingData from "./LoadingData";
import ShopCard, { ShopProps } from "./ShopCard";
import Typed from "typed.js";

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
    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: [
          "Empty Achievement Inventory!!",
          "Visit The Shop To Get Some!!",
        ],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
        showCursor: false,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  const length: boolean = data?.length ? true : false;
  if (!length)
    return (
      <div className="textContainer">
        <h1 className="emptyData"></h1>
      </div>
    );

  return (
    <>
      {isLoading
        ? LoadingData()
        : !isLoading &&
          length && (
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
