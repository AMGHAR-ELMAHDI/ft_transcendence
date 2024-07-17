import { useEffect, useState } from "react";
import api from "../../api";
import AcheivementCard from "./AcheivementCard";
import LoadingData from "./LoadingData";
import { UserDataProps } from "./ProfileItems";
import Typed from "typed.js";

export interface CardProps {
  id: number;
  title: string;
  desc: string;
  path: string;
  Obtaining_date: string;
}

function ProfileAcheivements({ UserData, UseUserData }: UserDataProps) {
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
    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["Empty Items Inventory!!", "Visit The Shop To Get Some!!"],
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
      {isLoading ? (
        LoadingData()
      ) : (
        <div className="ProfileItems">
          {data?.map((Trophie: CardProps) => (
            <AcheivementCard key={Trophie.id} {...Trophie} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProfileAcheivements;
