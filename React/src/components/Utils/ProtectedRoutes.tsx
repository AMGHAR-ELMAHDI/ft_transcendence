import { Outlet, Navigate } from "react-router-dom";

const getCookie = (name: string) => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  console.log(cookies);
  
  return cookies ? cookies.split("=")[1] : null;
};

// Example: Get the value of the 'username' cookie

function ProtectedRoutes() {
  const username = getCookie("access");
  const cookies = document.cookie;
  console.log(cookies);
  
  console.log(username);
  
  let Logged = localStorage.getItem("token") ? true : false;
  if(username) Logged = true;
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
