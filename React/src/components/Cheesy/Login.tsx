import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import axios from "axios";

function getGeneralInfo() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const car = {
    username: username,
    password: password,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:2500/auth/jwt/create", car)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          console.log("Body" + response.data);
          const Login = JSON.parse(response.data);
          console.log(Login);
        }
        if (response.status === 401) {
          console.log("Invalid Username or Password");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form>
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
    </form>
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
