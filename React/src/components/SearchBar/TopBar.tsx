import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingData from "../Cheesy/LoadingData";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { TiThMenu } from "react-icons/ti";
import SearchBar from "./SearchBar";
import DrawerLinks from "./DrawerLinks";
import api from "../../api";

export function getPageName() {
  let pageName = window.location.pathname;

  if (window.location.pathname?.includes("/profile/")) return "User Profile";
  if (window.location.pathname?.includes("/game")) return "";
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

function getGreeting() {
  let currentHour = new Date().getHours();

  let print;
  if (currentHour < 12) print = <h1>Good Morning,</h1>;
  else if (currentHour < 18) print = <h1>Good Afternoon,</h1>;
  else print = <h1>Good Evening,</h1>;
  return print;
}

function TopBar() {
  const [data, setData] = React.useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getData = async () => {
    try {
      const response = await api.get("player/me");
      setData(response.data);
      setIsLoading(false);
    } catch (error: any) {
      if (error.request) {
        window.location.href = "/login";
        navigate("/login");
      } else console.log("Error message:", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();

  let username = <h1 id="nickName">{data?.username}</h1>;
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
          {window.location.pathname === "/" && getGreeting()}
          {window.location.pathname === "/" && username}
          {window.location.pathname !== "/" && (
            <h1 id="nickName">{getPageName()}</h1>
          )}
        </div>
        {SearchBar(data?.avatar)}
      </div>
    </>
  );
}

export default TopBar;
