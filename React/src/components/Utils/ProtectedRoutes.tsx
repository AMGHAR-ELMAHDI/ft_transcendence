import axios from "axios";
import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { setAuthToken } from "./setAuthToken";
import { useRecoilState } from "recoil";
import ProfilePic from "../../Atoms/ProfilePic";

const getCookie = (name: string) => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookies ? cookies.split("=")[1] : null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

function ProtectedRoutes() {
  const [data, setData] = useState<any>({});
  const [pic, setProfilePic] = useRecoilState(ProfilePic);

  const getData = async () => {
    try {
      const response = await axios.get("player/me");
      setData(response.data);
      setProfilePic(response.data?.avatar);
      console.log("here: " + response.data?.username);
    } catch (error: any) {
      console.log("Error message:", error.message);
    }
  };
  const access = getCookie("access");
  let Logged = localStorage.getItem("token") ? true : false;
  if (Logged) getData();
  if (access) {
    Logged = true;
    localStorage.setItem("token", access);
    setAuthToken();
    getData();
    deleteCookie("access");
  }
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
