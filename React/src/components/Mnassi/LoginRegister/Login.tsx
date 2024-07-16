import _loginEl from "./loginEl";
import _idx from "./idx";
import _register from "./register";
import Dashboard from "../../Cheesy/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  const [status_code, getStatus] = useState<number>(0);

  const [error, setError] = useState("");
  useEffect(() => {
    var query = location.search;
    var error = query?.split("?");
    let stats = error[1]?.split("&");
    for (let i = 0; i < stats?.length; i++)
      if (stats[i]?.startsWith("status=")) {
        setError(stats[i]?.replace("status=", "")?.replace(/_/g, " "));
      }
  });

  useEffect(() => {
    // saving the client with 42 auth
    axios.defaults.withCredentials = true;
    axios
      ?.get("https://localhost:2500/check/", {
        withCredentials: true,
      })
      .then((response) => {
        if (response?.status == 200) getStatus(response?.status);
        else getStatus(response.status);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

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
