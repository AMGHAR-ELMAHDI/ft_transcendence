import { Outlet, Navigate } from "react-router-dom";

const getCookie = (name: string) => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookies ? cookies.split("=")[1] : null;
};

function ProtectedRoutes() {
  const access = getCookie("access");

  let Logged = localStorage.getItem("token") ? true : false;
  if (access) {
    Logged = true;
    localStorage.setItem("token", access);
  }
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
