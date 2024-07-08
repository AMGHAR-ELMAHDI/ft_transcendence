import axios from "axios";
import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { setAuthToken } from "./setAuthToken";

const getCookie = (name: string) => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookies ? cookies.split("=")[1] : null;
};

function ProtectedRoutes() {
  const [data, setData] = useState<any>({});

  const getData = async () => {
    try {
      const response = await axios.get("player/me");
      setData(response.data);
      console.log("here: " + response.data?.username);
    } catch (error: any) {
      console.log("Error message:", error.message);
    }
  };

  const access = getCookie("access");
  let Logged = localStorage.getItem("token") ? true : false;
  if (access) {
    Logged = true;
    localStorage.setItem("token", access);
    setAuthToken();
    getData();
    console.log("access: |" + access + "|");
  }
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNTE1OTk3LCJpYXQiOjE3MjA0Mjk1OTcsImp0aSI6IjUzZjgxZGZmYzkzZjRkMTY4MmQwZDdkYmUzNjY4Y2IyIiwidXNlcl9pZCI6MTN9.ARzunFgt36JyIqotGxjbLB-9yEoRsVor89UAarWc_w0
