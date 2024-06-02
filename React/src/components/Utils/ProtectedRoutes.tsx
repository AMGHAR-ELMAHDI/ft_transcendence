import { Outlet, Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import IsLogged from "../../Atoms/IsLogged";

function ProtectedRoutes() {
    const Logged =  useRecoilValue(IsLogged);
  return Logged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes