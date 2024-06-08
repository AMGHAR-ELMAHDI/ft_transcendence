import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import AcessToken from "../../Atoms/AccessToken";
import { setAuthToken } from "../Utils/setAuthToken";
import IsLogged from "../../Atoms/IsLogged";
import { useNavigate } from "react-router-dom";
import Url from "../../Atoms/Url";

function getGeneralInfo() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenValue, setTokenValue] = useRecoilState(AcessToken);
  const [Logged, setLogged] = useRecoilState(IsLogged);
  const url = useRecoilValue(Url);

  const obj = {
    username: username,
    password: password,
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post(url + "auth/jwt/create", obj)
      .then((response) => {
        var str = response.data;
        if (response.status === 200) {
          setTokenValue(str.access);
          setLogged(true);
          localStorage.setItem("token", str.access);
          navigate("/");
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
      </div>
    </>
  );
}

export default Login;
