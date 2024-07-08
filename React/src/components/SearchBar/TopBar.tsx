import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingData from "../Cheesy/LoadingData";
import Drawer from "react-modern-drawer";
import { TiThMenu } from "react-icons/ti";
import "react-modern-drawer/dist/index.css";
import SearchBar from "./SearchBar";
import DrawerLinks from "./DrawerLinks";
import api from "../../api";
import GetGreeting, { getPageName } from "./GetGreeting";
import DropDownMenuContainer from "./DropDownMenuContainer";
import Notif from "../Cheesy/Notif";
import { useRecoilState } from "recoil";
import Username from "../../Atoms/Username";

function TopBar() {
  const [data, setData] = React.useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [recoilUsername, setRecoilUsername] = useRecoilState(Username);

  const getData = async () => {
    try {
      const response = await api.get("player/me");
      setData(response.data);
      setIsLoading(false);
      setRecoilUsername(response.data?.username);
      console.log(response.data?.username);
    } catch (error: any) {
      if (error.request) {
        // window.location.href = "/login";
        // navigate("/login");
      } else console.log("Error message:", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  console.log(data?.avatar);

  return (
    <>
      {isLoading && LoadingData()}
      <div id="TopBar">
        <div className="absolute">
          <div className="BurgerMenu">
            <TiThMenu onClick={() => setIsOpen(!isOpen)} />
          </div>
          <Drawer
            open={isOpen}
            onClose={() => setIsOpen(!isOpen)}
            direction="left"
            className="Drawer"
          >
            <DrawerLinks />
          </Drawer>
        </div>

        <div id="welcome-bar">
          {window.location.pathname === "/" && GetGreeting()}
          {window.location.pathname === "/" && (
            <h1 id="nickName">{data?.username}</h1>
          )}
          {window.location.pathname !== "/" && (
            <h1 id="nickName">{getPageName()}</h1>
          )}
        </div>
        <div className="NotifProfile">
          {<SearchBar />}
          <div className="NotifProfileContainer">
            {<Notif />}
            {<DropDownMenuContainer avatar={data?.avatar} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default TopBar;
