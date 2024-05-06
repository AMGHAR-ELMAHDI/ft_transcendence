import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import { CgProfile } from "react-icons/cg";
import { IoShieldHalfSharp } from "react-icons/io5";
import axios from "axios";

function getGeneralInfo() {
  return (
    <div className="GeneralInfoContainer">
      <form method="POST" action="http://localhost:2500/auth/jwt/create">
        <div>
          <input
            className="GeneralInfoInput"
            type="text"
            id="username"
            name="username"
            placeholder={"Username"}
          />
        </div>
        <div className="FirstSecondName">
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            className="GeneralInfoInput firstSecond"
            placeholder={"First Name"}
          />
          <input
            type="text"
            id="SecondName"
            name="SecondName"
            className="GeneralInfoInput firstSecond"
            placeholder={"Second Name"}
          />
        </div>

        <div>
          <input
            className="GeneralInfoInput"
            type="email"
            id="email"
            name="email"
            placeholder={"Email"}
          />
        </div>
        <div>
          <input
            className="GeneralInfoInput"
            type="password"
            id="password"
            name="password"
            placeholder={"Password"}
          />
        </div>

        <div className="ButtonContainer">
          <button className="SetButton SetCancel" type="reset">
            Cancel
          </button>
          <button className="SetButton SetSubmit" type="submit">
            Submit
          </button>
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
            <div className="SettingsComponents">
              <div className="LeftSpacer">
                <div
                  onClick={() => setRender("GeneralInfo")}
                  className="SetInfo GeneralInfo"
                >
                  <CgProfile className="SetIcon" />
                  <h1 className="blk">General Information</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="SettingsRight">
            {render === "GeneralInfo" && getGeneralInfo()}
          </div>
        </div>
      </div>
    </>
  );
}

function Login() {
  //  useEffect(() => {
  //   axios
  //     .post("http://localhost:8000/get/") 
  //     .then((response) => {
  //       if (response.status === 200) {
  //         const LeaderBoard = JSON.parse(response.data);
  //         console.log(LeaderBoard[0]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });
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

export default Login;
