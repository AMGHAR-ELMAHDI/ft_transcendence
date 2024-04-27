import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Profile from "./Profile";
import FriendBar from "./FriendBar";
import Dashboard from "./Dashboard";

function getLanguage() {
  return (
    <>
      <h1>Language</h1>
    </>
  );
}

function getSecurity() {
  return (
    <>
      <h1>Security</h1>
    </>
  );
}

function getGeneralInfo() {
  return (
    <div className="GeneralInfoContainer">
      <form>
        <div>
          <label htmlFor="username">Name:</label>
          <input type="text" id="username" name="username" placeholder={"Username"} />
        </div>
        <div>
          <label htmlFor="FirstName">Name:</label>
          <input type="text" id="FirstName" name="FirstName" placeholder={"First Name"} />

          <label htmlFor="SecondName">Name:</label>
          <input type="text" id="SecondName" name="SecondName" placeholder={"Second Name"} />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder={"Email"} />
        </div>

      <div>
          <button type="submit">Cancel</button>
          <button type="submit">Submit</button>
      </div>

      </form>
    </div>
  );
}

function MainSettings() {
  const [render, setRender] = useState<string>("GeneralInfo");

  return (
    <>
      <div className="MainSettings">
        <h1 className="SettingsH1">SETTINGS</h1>
        <div className="SettingsContent">
          <div className="SettingsLeft">
            <div className="SettingsData">
              <div className="SettingsImg">
                <img src="/60sGirl.png" alt="SettingProfilesimg" />
              </div>
              <div className="SettingsUsrName">
                <h1 className="wht">{"Cheesy"}</h1>
              </div>
              <div className="SettingsFullName">
                <h1 className="wht">{"ELMAHDI AMGHAR"}</h1>
              </div>
            </div>
            <div
              onClick={() => setRender("GeneralInfo")}
              className="SetInfo GeneralInfo"
            >
              <img className="SetIcon" src="/SetProfile.svg" alt="Icon" />
              <h1 className="blk">General Information</h1>
            </div>
            <div
              onClick={() => setRender("Security")}
              className="SetInfo Security"
            >
              <img className="SetIcon" src="/SetShield.svg" alt="Icon" />
              <h1 className="blk">Security</h1>
            </div>

            <div
              onClick={() => setRender("Language")}
              className="SetInfo Language"
            >
              <img className="SetIcon" src="/SetLang.svg" alt="Icon" />
              <h1 className="blk">Language</h1>
            </div>
          </div>
          <div className="SettingsRight">
            {render === "GeneralInfo" && getGeneralInfo()}
            {render === "Security" && getSecurity()}
            {render === "Language" && getLanguage()}
          </div>
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
