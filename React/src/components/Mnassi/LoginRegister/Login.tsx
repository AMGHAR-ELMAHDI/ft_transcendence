import _loginEl from "./loginEl";
import _idx from "./idx";
import _register from "./register";
import Dashboard from "../../Cheesy/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  return (
    <>
      <div className="allComp">
        <_idx></_idx>
        <_loginEl></_loginEl>
      </div>
    </>
  );
}

export default Login;
