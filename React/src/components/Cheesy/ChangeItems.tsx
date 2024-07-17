import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import api from "../../api";
import Typed from "typed.js";
import SettingsCard from "./SettingsCard";
import LoadingData from "./LoadingData";

export interface SettingsProps {
  id: number;
  type: string;
  name: string;
  price: string;
  path: string;
}

export interface SettingsProps {
  email: string;
  table_id: number;
  paddle_id: number;
  ball_id: number;
}

function ChangeItems() {
  const [items, setItems] = useState([]);
  const [equiped, setEquiped] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setAuthToken();
    const getowned = async () => {
      try {
        const response = await api.get("player/items/");
        setItems(response.data.items);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    const getEquiped = async () => {
      try {
        const response = await api.get("player/set/");
        setEquiped(response.data.items);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getowned();
    getEquiped();
    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["No Owened Items!!", "Visit The Shop To Get Some!!"],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  console.log("items length: " + items.length);

  if (!items.length)
    return (
      <div className="textContainer">
        <h1 className="emptyData"></h1>
      </div>
    );

  const paddles = items?.filter((item: SettingsProps) => item?.type === "P");
  const backgrounds = items?.filter(
    (item: SettingsProps) => item?.type === "G"
  );
  const balls = items?.filter((item: SettingsProps) => item?.type === "B");

  return (
    <>
      {isLoading && <LoadingData />}
      {!isLoading && (
        <div className="settingsItems">
          {paddles.length != 0 && <h1>Paddles</h1>}
          {paddles.length != 0 && (
            <div className="settingsPaddlesContainer">
              {paddles.map((item: SettingsProps) => (
                <SettingsCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  path={item.path}
                  price={item.price}
                  type={item.type}
                  change={"P"}
                  email={equiped?.email}
                  ball={equiped?.ball}
                  paddle={equiped?.paddle}
                  table={equiped?.table}
                />
              ))}
            </div>
          )}
          {backgrounds.length != 0 && <h1>Backgrounds</h1>}
          {backgrounds.length != 0 && (
            <div className="settingsBackgroundsContainer">
              {backgrounds.map((item: SettingsProps) => (
                <SettingsCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  path={item.path}
                  price={item.price}
                  type={item.type}
                  change={"G"}
                  email={equiped?.email}
                  ball={equiped?.ball}
                  paddle={equiped?.paddle}
                  table={equiped?.table}
                />
              ))}
            </div>
          )}
          {balls.length != 0 && <h1>Balls</h1>}
          {balls.length != 0 && (
            <div className="settingsBallsContainer">
              {balls.map((item: SettingsProps) => (
                <SettingsCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  path={item.path}
                  price={item.price}
                  type={item.type}
                  change={"B"}
                  email={equiped?.email}
                  ball={equiped?.ball}
                  paddle={equiped?.paddle}
                  table={equiped?.table}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChangeItems;
