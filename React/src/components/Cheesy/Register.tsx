import { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [re_password, setRe_password] = useState("");
  const [Loged, setLoged] = useState(false);

  const navigate = useNavigate();

  const obj = {
    username: username,
    email: email,
    password: password,
    re_password: re_password,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post("http://localhost:2500/auth/users/", obj)
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          setLoged(true);
          navigate("/login");
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
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="GeneralInfoInput"
        type="email"
        name="email"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="GeneralInfoInput"
        type="password"
        name="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="GeneralInfoInput"
        type="password"
        name="re_password"
        value={re_password}
        placeholder="re-password"
        onChange={(e) => setRe_password(e.target.value)}
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
        <h1 className="SettingsH1">Register</h1>
        <div className="SettingsContent">{getRegister()}</div>
      </div>
    </>
  );
}

function Register() {
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

export default Register;
