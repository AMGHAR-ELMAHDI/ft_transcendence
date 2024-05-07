import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import axios from "axios";

function getGeneralInfo() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const obj = {
    username: username,
    password: password,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:2500/auth/jwt/create", obj)
      .then((response) => {
        console.log(response);
        console.log("---------------DATA------------------");
        console.log(response.data);
        console.log("---------------END OF DATA------------------");
        console.log("---------------JSON------------------");
        var str = JSON.stringify(response.data);
        JSON.parse(str, (key, value) => {console.log(key, value)});

        
        console.log("---------------END OF JSON------------------");

        if (response.status === 200) {
          // console.log("Body" + response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <input
        className="GeneralInfoInput"
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="GeneralInfoInput"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="SetButton SetSubmit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

function MainSettings() {
  return (
    <>
      <div className="MainSettings">
        <h1 className="SettingsH1">Login</h1>
        <div className="SettingsContent">
          <div className="SettingsRight">{getGeneralInfo()}</div>
        </div>
      </div>
    </>
  );
}

function Login() {
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
