import { useNavigate } from "react-router-dom";
import _loginEl from "./loginEl";
import _register from "./register";

function Login() {
  const navigate = useNavigate();
  return (
    <>
      <div className="allComp">
        <div className="header">
          <img src="/logo.png" onClick={() => navigate("/login")}></img>
          <h1>ping pong</h1>
        </div>
        <_loginEl></_loginEl>
      </div>
    </>
  );
}

export default Login;
