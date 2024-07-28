import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaDiscord } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import Url from "../../../Atoms/Url";
import PasswordSvg from "./PasswordSvg";
import EmailSvg from "./EmailSvg";
import ProfileSvg from "./ProfileSvg";
import toast from "react-hot-toast";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const url = useRecoilValue(Url);

  const navigate = useNavigate();

  const obj = {
    username: username,
    email: email,
    password: password,
    password2: password,
  };

  const handleDiscordAuth = () => {

    
    window.location.href = import.meta.env.VITE_API_URL + "discord/login/";
  };

  const handle42Auth = () => {
    window.location.href = import.meta.env.VITE_API_URL + "42/login/";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .post(url + "sign-up/", obj)
      .then((response) => {
        if (response.status === 201) {
          navigate("/login");
          toast.success("Account created successfully");
        }
      })
      .catch((error) => {
        if (error.response) {
          if(error.response.data.username)
            toast.error(error.response.data.username[0])
          if(error.response.data.email)
              toast.error(error.response.data.email[0])
          if(error.response.data.password)
            toast.error(error.response.data.password[0])
        }
      });
  };

  return (
    <div className="allComp">
      <div className="header">
        <img src="/logo.png"></img>
        <h1>ping pong</h1>
      </div>
      <div className="content">
        <div className="register">
          <div className="top_">
            <h1>create new account</h1>
            <span className="dot"></span>
          </div>
          <div className="member">
            <p>
              already a member ? <Link to={"/login"}>log in</Link>
            </p>
          </div>
          <div className="fullname">
            <div className="custom-input_f">
              <input
                id="fullname"
                type="text"
                required
                name="username"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="custom-placeholder_f">Username</label>
            </div>
            <ProfileSvg />
          </div>
          <div className="email">
            <div className="custom-input">
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                required
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="custom-placeholder">email</label>
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
                required
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="custom-placeholder">password</label>
            </div>
            <PasswordSvg />
          </div>
          <div className="buttons">
            <button onClick={handle42Auth} className="fortytwo">
              <img src="/42.svg"></img>
            </button>
            <button onClick={handleDiscordAuth} className="gmail">
              <FaDiscord className="ds" />
            </button>
            <button className="create" onClick={handleSubmit}>
              create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
