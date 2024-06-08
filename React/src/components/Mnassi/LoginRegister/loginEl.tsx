import { useEffect, useState } from "react";
import _loginEl from "./loginEl";
import { useRecoilState, useRecoilValue } from "recoil";
import IsLogged from "../../../Atoms/IsLogged";
import Url from "../../../Atoms/Url";
import AcessToken from "../../../Atoms/AccessToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

function loginEl() {
  const [error, setError] = useState("");
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

  // useEffect(() => {

  // 	function EmailSyntax(input: string) : boolean {
  // 		const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 		return emailRegex.test(input)
  // 	}

  // 	const register = document?.querySelector('.login_btn') as HTMLElement;
  // 	const content_ = document?.querySelector('.login') as HTMLElement;

  // 	// loggin in
  // 	register?.addEventListener('click', () => {
  // 		let CaseErr: boolean = false
  // 		const inputs: NodeListOf<HTMLInputElement> = document?.querySelectorAll('.login input');
  // 		inputs?.forEach((input: HTMLInputElement) => {
  // 			if (input?.value === "")
  // 				return input?.classList.add('error'), setTimeout(() => input?.classList.remove('error'), 500), CaseErr = true, 0
  // 			if (input?.name === 'emailLog')
  // 				if (!EmailSyntax(input?.value))
  // 					return input?.classList.add('error'), setTimeout(() => input?.classList.remove('error'), 500), CaseErr = true,0;
  // 			else
  // 				input?.classList.add('good');
  // 		});
  // 		if (CaseErr)
  // 			return
  // 		content_?.classList?.add('swipe');
  // 		content_?.classList?.remove('show');
  // 		document?.querySelector('.header')!.classList?.add('move');
  // 		var headers = {
  // 		'email' : document?.querySelector<HTMLInputElement>('input[name="emailLog"]')?.value || '',
  // 		'password' : document?.querySelector<HTMLInputElement>('input[name="passwdLog"]')?.value || ''
  // 		}
  // 		setTimeout(() => window.location.href = 'http://localhost:2500/UserLogin/?email=' + encodeURIComponent(headers.email) + "&password=" + encodeURIComponent(headers.password), 1000);
  // 	})

  // 	var query = location.search
  // 	var error = query?.split('?')
  // 	let stats = error[1]?.split('&')
  // 	for (let i = 0; i < stats?.length; i++)
  // 		if (stats[i]?.startsWith('status=')) {
  // 			setError(stats[i]?.replace('status=', '')?.replace(/_/g, ' '))
  // 	}
  // })

  return (
    <div className="content">
      <div className="login">
        <div className="top_">
          <h1>log in</h1>
          <span className="dot"></span>
        </div>
        <div className="member">
          <p>
            don't have an account ? <a className="regis">register</a>
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
            ></input>
            <label className="custom-placeholder">Username</label>
          </div>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            color="#1d90f5"
            fill="none"
          >
            <path
              d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
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
            ></input>
            <label className="custom-placeholder">password</label>
          </div>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            color="#1d90f5"
            fill="none"
          >
            <path
              d="M13.9928 15L14 15M10 15L10.0072 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16.5 9.5V6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5V9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {error.length > 0 ? <div className="statusError">{error}</div> : ""}
        <div className="buttons">
          <button className="fourtytwo">
            <img src="../public/42.svg"></img>
          </button>
          <button className="gmail">
            <img src="../public/google.svg"></img>
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