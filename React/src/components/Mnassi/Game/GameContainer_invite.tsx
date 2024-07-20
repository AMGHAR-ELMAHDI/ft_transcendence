import TopBar from "../../SearchBar/TopBar";
import InvitedUsers from "./invitedUsers";
import OnlineStatus from "../../zmakhkha/OnlineStatus";
import { useEffect, useState } from "react";
import SideBar from "../../Cheesy/SideBar";
import api from "../../../api";
import { setAuthToken } from "../../Utils/setAuthToken";

export default function GameContainer() {
  const [Name, setName] = useState("");
  const [Name2, setName2] = useState("");
  const token: any = localStorage.getItem("token");
  setAuthToken();

  useEffect(() => {
    const inviteID = localStorage.getItem("invite_id");
    api.get(`user/${inviteID}/`).then((resp) => {
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
          <InvitedUsers Name={Name} Name2={Name2} />
        </div>
      </div>
    </>
  );
}
