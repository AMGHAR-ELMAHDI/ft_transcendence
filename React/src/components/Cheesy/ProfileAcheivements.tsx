import { useEffect, useState } from "react";
import api from "../../api";
import AcheivementCard from "./AcheivementCard";
import LoadingData from "./LoadingData";
import { UserDataProps } from "./ProfileItems";

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
  }, []);

  const length: boolean = data?.length ? true : false;

  return (
    <>
      {isLoading && LoadingData()}
      {!isLoading && !length ? (
        <div className="ProfileItems">
          <h1 className="emptyData">No Trophies</h1>
        </div>
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
