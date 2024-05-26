import { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import TopBar from "../SearchBar/TopBar";
import FriendBar from "./FriendBar";
import { CgProfile } from "react-icons/cg";
import { IoShieldHalfSharp } from "react-icons/io5";
import api from "../../api";
import SettingsGeneralInfo from "./SettingsGeneralInfo";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { BiEdit } from "react-icons/bi";

function getSecurity() {
  return (
    <>
      <h1>Security</h1>
    </>
  );
}

function MainSettings() {
  const [data, setData] = useState<any>();
  const [render, setRender] = useState<string>("GeneralInfo");
  const [renderButton, setRenderButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const url = useRecoilValue(Url);

  let obj = {
    id: "1",
    email: data?.email,
    first_name: data?.first_name,
    last_name: data?.last_name,
    username: data?.username,
    image: null,
  };

  const getData = async () => {
    try {
      const response = await api.get("player/setting/");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRenderButton(false);

    try {
      const formData = new FormData();
      formData.append("id", obj.id);
      formData.append("email", obj.email);
      formData.append("first_name", obj.first_name);
      formData.append("last_name", obj.last_name);
      formData.append("username", obj.username);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const response = await api.put("player/setting/", formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="MainSettings">
        <div className="SettingsContent">
          <div className="SettingsLeft">
            <div className="SettingsData">
              <div className="SettingsImg">
                <img
                  src={url.slice(0, url.length - 1) + data?.image}
                  alt="SettingImg"
                />

                <div className="SettingsImgEdit">
                  <label>
                    <input type="file" ref={fileInputRef} />
                    <div
                      id="SettingsEdit"
                      onClick={() => setRenderButton(true)}
                    >
                      <BiEdit />
                    </div>
                  </label>
                </div>
              </div>

              {renderButton && (
                <button id="buttonTest" onClick={handleSubmit}>
                  Change Image
                </button>
              )}
              {!renderButton && (
                <div className="SettingsDataContainer">
                  <div className="SettingsUsrName">
                    <h1 className="wht">{obj.username}</h1>
                  </div>
                  <div className="SettingsFullName">
                    <h1 className="wht">
                      {obj.first_name + " " + obj.last_name}
                    </h1>
                  </div>
                </div>
              )}
            </div>

            <div className="SettingsComponents">
              <div className="LeftSpacer">
                <div
                  onClick={() => setRender("GeneralInfo")}
                  className="SetInfo GeneralInfo"
                >
                  <CgProfile className="SetIcon" />
                  <h1 className="blk">General Information</h1>
                </div>
              </div>
              <div className="LeftSpacer">
                <div
                  onClick={() => setRender("Security")}
                  className="SetInfo Security"
                >
                  <IoShieldHalfSharp className="SetIcon" />
                  <h1 className="blk">Security</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="SettingsRight">
            {render === "GeneralInfo" && <SettingsGeneralInfo />}
            {render === "Security" && getSecurity()}
          </div>
        </div>
      </div>
    </>
  );
}

function Settings() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <div className="MainSettingsContainer">
            <MainSettings />
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default Settings;
