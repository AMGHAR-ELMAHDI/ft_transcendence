import { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import SettingsGeneralInfo from "./SettingsGeneralInfo";
import GetSecurity from "./GetSecurity";
import SettingsLeft from "./SettingsLeft";
import ChangeItems from "./ChangeItems";

function MainSettings() {
  const [render, setRender] = useState<string>("GeneralInfo");
  return (
    <>
      <div className="MainSettings">
        <div className="SettingsContent">
          <SettingsLeft setRender={setRender} />
          {(render === "GeneralInfo" || render === "Security") && (
            <div className="SettingsRight">
              {render === "GeneralInfo" && <SettingsGeneralInfo />}
              {render === "Security" && <GetSecurity />}
            </div>
          )}
          {render === "Items" && (
            <div className="SettingItemsContainer">
              <ChangeItems />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Settings() {
  return (
    <>
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
