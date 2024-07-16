import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import SettingsGeneralInfo from "./SettingsGeneralInfo";
import GetSecurity from "./GetSecurity";
import SettingsLeft from "./SettingsLeft";

interface Props {
  setReRender: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainSettings({ setReRender }: Props) {
  const [render, setRender] = useState<string>("GeneralInfo");
  return (
    <>
      <div className="MainSettings">
        <div className="SettingsContent">
          <SettingsLeft setRender={setRender} setReRender={setReRender} />
          <div className="SettingsRight">
            {render === "GeneralInfo" && <SettingsGeneralInfo />}
            {render === "Security" && <GetSecurity />}
          </div>
        </div>
      </div>
    </>
  );
}

function Settings() {
  const [reRender, setReRender] = useState<boolean>(false);
  useEffect(() => {
    <TopBar />;
  }, [reRender]);

  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <div className="MainSettingsContainer">
            <MainSettings setReRender={setReRender} />
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default Settings;
