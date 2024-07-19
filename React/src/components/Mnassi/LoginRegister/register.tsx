import { FaDiscord } from "react-icons/fa";
import _register from './register';
import { Link } from "react-router-dom";

function register() {
		const handleDiscordAuth = () => {
			window.location.href =import.meta.env.VITE_API_URL+  "discord/login/";
		};
		const handle42Auth = () => {
			window.location.href = import.meta.env.VITE_API_URL+ "42/login/";
		  };
	return (
			<div className="content">
				<div className="register">
					<div className="top_">
						<h1>create new account</h1>
						<span className="dot"></span>
					</div>
					<div className="member">
						<p>Already a <Link to={"/login"}>Member login</Link></p>
					</div>
					<div className="fullname">
						<div className="custom-input_f">
							<input id="fullname" name='FirstName' required></input>
							<label className="custom-placeholder_f">first name</label>
						</div>
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#1d90f5" fill="none">
							<path d="M8.5 18C10.3135 16.0463 13.667 15.9543 15.5 18M13.9406 12C13.9406 13.1046 13.0688 14 11.9934 14C10.918 14 10.0462 13.1046 10.0462 12C10.0462 10.8954 10.918 10 11.9934 10C13.0688 10 13.9406 10.8954 13.9406 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							<path d="M9.5 4.00195C6.85561 4.01181 5.44101 4.10427 4.52513 4.97195C3.5 5.94312 3.5 7.5062 3.5 10.6324V15.3692C3.5 18.4954 3.5 20.0584 4.52513 21.0296C5.55025 22.0008 7.20017 22.0008 10.5 22.0008H13.5C16.7998 22.0008 18.4497 22.0008 19.4749 21.0296C20.5 20.0584 20.5 18.4954 20.5 15.3692V10.6324C20.5 7.5062 20.5 5.94312 19.4749 4.97195C18.559 4.10427 17.1444 4.01181 14.5 4.00195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M9.77216 3.63163C9.8681 3.21682 9.91608 3.00942 10.0082 2.84004C10.2229 2.44546 10.6188 2.15548 11.0914 2.0467C11.2943 2 11.5296 2 12 2C12.4704 2 12.7057 2 12.9086 2.0467C13.3812 2.15548 13.7771 2.44545 13.9918 2.84004C14.0839 3.00942 14.1319 3.21682 14.2278 3.63163L14.3111 3.99176C14.4813 4.72744 14.5664 5.09528 14.438 5.37824C14.3549 5.5615 14.2132 5.71842 14.031 5.82911C13.7496 6 13.3324 6 12.4981 6H11.5019C10.6676 6 10.2504 6 9.96901 5.82911C9.78677 5.71842 9.6451 5.5615 9.56197 5.37824C9.43361 5.09528 9.51869 4.72744 9.68886 3.99176L9.77216 3.63163Z" stroke="currentColor" strokeWidth="1.5" />
						</svg>
						<div className="custom-input_f">
							<input id="fullname" name='LastName' required></input>
							<label className="custom-placeholder_f">last name</label>
						</div>
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#1d90f5" fill="none">
							<path d="M8.5 18C10.3135 16.0463 13.667 15.9543 15.5 18M13.9406 12C13.9406 13.1046 13.0688 14 11.9934 14C10.918 14 10.0462 13.1046 10.0462 12C10.0462 10.8954 10.918 10 11.9934 10C13.0688 10 13.9406 10.8954 13.9406 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							<path d="M9.5 4.00195C6.85561 4.01181 5.44101 4.10427 4.52513 4.97195C3.5 5.94312 3.5 7.5062 3.5 10.6324V15.3692C3.5 18.4954 3.5 20.0584 4.52513 21.0296C5.55025 22.0008 7.20017 22.0008 10.5 22.0008H13.5C16.7998 22.0008 18.4497 22.0008 19.4749 21.0296C20.5 20.0584 20.5 18.4954 20.5 15.3692V10.6324C20.5 7.5062 20.5 5.94312 19.4749 4.97195C18.559 4.10427 17.1444 4.01181 14.5 4.00195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M9.77216 3.63163C9.8681 3.21682 9.91608 3.00942 10.0082 2.84004C10.2229 2.44546 10.6188 2.15548 11.0914 2.0467C11.2943 2 11.5296 2 12 2C12.4704 2 12.7057 2 12.9086 2.0467C13.3812 2.15548 13.7771 2.44545 13.9918 2.84004C14.0839 3.00942 14.1319 3.21682 14.2278 3.63163L14.3111 3.99176C14.4813 4.72744 14.5664 5.09528 14.438 5.37824C14.3549 5.5615 14.2132 5.71842 14.031 5.82911C13.7496 6 13.3324 6 12.4981 6H11.5019C10.6676 6 10.2504 6 9.96901 5.82911C9.78677 5.71842 9.6451 5.5615 9.56197 5.37824C9.43361 5.09528 9.51869 4.72744 9.68886 3.99176L9.77216 3.63163Z" stroke="currentColor" strokeWidth="1.5" />
						</svg>
					</div>
					<div className="email">
						<div className="custom-input">
							<input id="email" name='emailIn' required></input>
							<label className="custom-placeholder">email</label>
						</div>
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#1d90f5" fill="none">
							<path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
							<path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
						</svg>
					</div>
					<div className="password">
						<div className="custom-input">
							<input id="pass" type="password" name='password' required></input>
							<label className="custom-placeholder">password</label>
						</div>
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#1d90f5" fill="none">
							<path d="M13.9928 15L14 15M10 15L10.0072 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15Z" stroke="currentColor" strokeWidth="1.5" />
							<path d="M16.5 9.5V6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</div>
					<div className="buttons">
						<button className="fortytwo" onClick={handle42Auth}><img src="/42.svg"></img></button>
						<button className="gmail" onClick={handleDiscordAuth}><FaDiscord className="ds" /></button>
						<button className="create">create account</button>
					</div>
				</div>
			</div>
	);
}

export default register;