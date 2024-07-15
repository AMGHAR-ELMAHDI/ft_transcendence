import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import InvitedUsers from "../Mnassi/Game/invitedUsers";
import OnlineStatus from "../zmakhkha/OnlineStatus";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GameContainer() {
  const [Name, setName] = useState("");
  const [Name2, setName2] = useState("");
  const token: any = localStorage.getItem("token");

  useEffect(() => {
    const inviteID = localStorage.getItem("invite_id");
    axios.get(`https://localhost:2500/user/${inviteID}/`).then((resp) => {
      setName(resp.data.sender);
      setName2(resp.data.receiver);
    });
  }, []);
  return (
    <>
      <OnlineStatus token={token} type={1} />
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <InvitedUsers Type="" Name={Name} Name2={Name2} />
        </div>
      </div>
    </>
  );
}
