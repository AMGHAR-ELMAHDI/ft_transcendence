import React from "react";
import { Link } from "react-router-dom";

interface Props {
  onCancel: React.Dispatch<React.SetStateAction<Boolean>>;
  onConfirm: React.Dispatch<React.SetStateAction<Boolean>>;
}

function LogoutPopUp({ onConfirm, onCancel }: Props) {
  return (
    <div className="LogoutContainer">
      <h1>Logout</h1>
      <div className="LogoutButtons">
        <button onClick={() => onCancel(false)}>Cancel</button>
        <Link to={"/login"}><button onClick={() => onConfirm(true)}>Confirm</button></Link>
      </div>
    </div>
  );
}


export default LogoutPopUp;
