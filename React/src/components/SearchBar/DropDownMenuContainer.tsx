import { useState } from "react";
import { GetCorrect } from "../Cheesy/LeaderBoardGetTop3";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { Link } from "react-router-dom";

const DropdownMenu = () => {
  return (
    <div className="dropdown-menu">
      <ul>
        <li>
          <Link to={"/profile"}> Profile</Link>
        </li>
        <li>
          <Link to={"/settings"}> Settings</Link>
        </li>
      </ul>
    </div>
  );
};

interface Props {
  avatar: string;
}

function DropDownMenuContainer({ avatar }: Props) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const url = useRecoilValue(Url);

  return (
    <div
      className="div-relat"
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <img className="NotifProfilePic" src={GetCorrect(avatar, url)} />
      {isDropdownVisible && <DropdownMenu />}
    </div>
  );
}

export default DropDownMenuContainer;
