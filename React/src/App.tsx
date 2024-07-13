import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import './components/Mnassi/Game/responsive.css'
import DashboardContainer from "./components/Cheesy/DashboardContainer";
import ProfileContainer from "./components/Cheesy/ProfileContainer";
import ChatContainer from "./components/Otchekai/ChatContainer";

import GameContainer_invite from "./components/Cheesy/GameContainer_invite";
import TestingTn from "./components/Mnassi/Game/TournamentList";
import LeaderBoardContainer from "./components/Cheesy/LeaderBoardContainer";
import NotFound from "./components/Cheesy/NotFound";
import Settings from "./components/Cheesy/Settings";
import ShopContainer from "./components/Otchekai/ShopContainer";
import Login from "./components/Mnassi/LoginRegister/Login";
import _tournament from "./components/Mnassi/Game/tournament";
import _secret from "./components/Mnassi/Game/secretCompo";
import Register from "./components/Cheesy/Register";
import Users, { UsersLoader } from "./components/Cheesy/Users";
import ProfileLayout from "./components/Cheesy/ProfileLayout";
import ProtectedRoutes from "./components/Utils/ProtectedRoutes";
import Verify2FA from "./components/zmakhkha/Verify2FA";
import { Toaster } from "react-hot-toast";
import Error_403 from "./components/Cheesy/Error403";

import "./Imports";
import Gametst from "./components/zmakhkha/Gametst";
import GameLayout from "./components/Cheesy/GameLayout";
import GameContainer from "./components/Mnassi/Game/GameContainer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/drake" element={<_secret />} />
      <Route path="/twoFa" element={<Verify2FA />} />
      <Route path="/403" element={<Error_403 />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardContainer />} />
        <Route path="/chat" element={<ChatContainer />} />
        <Route path="game" element={<GameLayout />} >
          <Route index element={<GameContainer />}/ >
          <Route path="gameplay" element={<_tournament NetType="" />}/ >
        </Route>
        <Route path="/leaderboard" element={<LeaderBoardContainer />} />
        <Route path="/shop" element={<ShopContainer />} />
        <Route path="/invite-only" element={<GameContainer_invite />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfileContainer />} />
          <Route path=":username" element={<Users />} loader={UsersLoader} />
        </Route>
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: "toaster",
        }}
      />
    </>
  );
}

export default App;
