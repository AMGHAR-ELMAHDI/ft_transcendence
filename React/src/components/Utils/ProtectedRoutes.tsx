import { Outlet, Navigate } from "react-router-dom";
import { setAuthToken } from "./setAuthToken";

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
  const access = getCookie("access");
  let Logged = localStorage.getItem("token") ? true : false;
  
  if (access) {
    Logged = true;
    localStorage.setItem("token", access);
    setAuthToken();
    deleteCookie("access");
  }
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
