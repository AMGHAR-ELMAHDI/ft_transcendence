import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoShieldHalfSharp } from "react-icons/io5";
import api from "../../api";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { BiEdit } from "react-icons/bi";
import { GetCorrect } from "./LeaderBoardGetTop3";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { GrSelect } from "react-icons/gr";

interface Props {
  setRender: React.Dispatch<React.SetStateAction<string>>;
}

function SettingsLeft({ setRender }: Props) {
  const [data, setData] = useState<any>();
  const [renderButton, setRenderButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const url = useRecoilValue(Url);
  const [file, setFile] = useState<any>();
  const [avatar, setAvatar] = useState<any>();

  const navigate = useNavigate();
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
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setFile(URL.createObjectURL(event.target.files[0]));
      setAvatar(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRenderButton(false);

    try {
      const formData = new FormData();
      formData.append("email", obj.email);
      formData.append("username", obj.username);
      formData.append("first_name", obj.first_name);
      formData.append("last_name", obj.last_name);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", avatar);
      }
      await api.put("player/setting/", formData);
      navigate("/");
    } catch (error: any) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data?.image[0]);
    }
  };

  return (
    <div className="SettingsLeft">
      <div className="SettingsData">
        <div className="SettingsImg">
          <img src={file || GetCorrect(data?.image, url)} />
          <div className="SettingsImgEdit">
            <label>
              <input type="file" ref={fileInputRef} onChange={onImageChange} />
              <div id="SettingsEdit" onClick={() => setRenderButton(true)}>
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
          </div>
        )}
      </div>

      <div className="SettingsComponents">
        <div onClick={() => setRender("GeneralInfo")} className="SetInfo">
          <CgProfile className="SetIcon" />
          <h1 className="blk">Data</h1>
        </div>
        <div onClick={() => setRender("Security")} className="SetInfo">
          <IoShieldHalfSharp className="SetIcon" />
          <h1 className="blk">Security</h1>
        </div>
        <div onClick={() => setRender("Items")} className="SetInfo">
          <GrSelect className="SetIcon" />
          <h1 className="blk">My Items</h1>
        </div>
      </div>
    </div>
  );
}

export default SettingsLeft;
