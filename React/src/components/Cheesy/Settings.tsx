import { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import SettingsGeneralInfo from "./SettingsGeneralInfo";
import OnlineStatus from "../zmakhkha/OnlineStatus";
import GetSecurity from "./GetSecurity";
import SettingsLeft from "./SettingsLeft";

function MainSettings() {
  const [render, setRender] = useState<string>("GeneralInfo");

  return (
    <>
      <div className="MainSettings">
        <div className="SettingsContent">
          <SettingsLeft setRender={setRender} />
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
  const token: any = localStorage.getItem("token");

  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <div className="MainSettingsContainer">
            <MainSettings />
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default Settings;
