import { Outlet, Navigate } from "react-router-dom";
function ProtectedRoutes() {
  const Logged = localStorage.getItem("token") ? true : false;
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
