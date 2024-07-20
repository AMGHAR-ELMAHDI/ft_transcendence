import { useEffect, useState } from "react";
import _loginEl from "./loginEl";
import { useRecoilValue } from "recoil";
import Url from "../../../Atoms/Url";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from "../../Utils/setAuthToken";
import toast from "react-hot-toast";
import { FaDiscord } from "react-icons/fa";
import EmailSvg from "./EmailSvg";
import PasswordSvg from "./PasswordSvg";

function loginEl() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const url = useRecoilValue(Url);

  const obj = {
    username: username,
    password: password,
  };
  console.log(import.meta.env.VITE_API_URL);

  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post(url + "sign-in/", obj)
      .then((response) => {
        var str = response.data;
        if (str.access === undefined)
          return toast.error("2FA REQUIRED"), navigate("/twoFa");

        if (response.status === 200) {
          toast.success("Logged in successfully");
          localStorage.setItem("token", str.access);
          setAuthToken();
          navigate("/");
        }
      })
      .catch((error) => {
        toast.error("Wrong Credentials");
        console.log(error);
      });
  };
  const handleDiscordAuth = () => {
    window.location.href = import.meta.env.VITE_API_URL + "discord/login/";
  };

  const handle42Auth = () => {
    window.location.href = import.meta.env.VITE_API_URL + "42/login/";
  };

  useEffect(() => {
    let Logged = localStorage.getItem("token") ? true : false;
    if (Logged) navigate("/");
  }, []);

  return (
    <div className="content">
      <div className="login">
        <div className="top_">
          <h1>log in</h1>
          <span className="dot"></span>
        </div>
        <div className="member">
          <p>
            don't have an account ? <Link to={"/register"}>register</Link>
          </p>
        </div>
        <div className="email">
          <div className="custom-input">
            <input
              id="email"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            ></input>
            <label className="custom-placeholder">Username</label>
          </div>
          <EmailSvg />
        </div>
        <div className="password">
          <div className="custom-input">
            <input
              id="pass"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            ></input>
            <label className="custom-placeholder">password</label>
          </div>
          <PasswordSvg />
        </div>
        <div className="buttons">
          <button className="fortytwo" onClick={handle42Auth}>
            <img src="/42.svg"></img>
          </button>
          <button className="gmail" onClick={handleDiscordAuth}>
            <FaDiscord className="ds" />
          </button>
          <button className="login_btn" onClick={handleSubmit}>
            login
          </button>
        </div>
      </div>
    </div>
  );
}

export default loginEl;
