import React from "react";
import { Link } from "react-router-dom";

interface Props {
  onCancel: React.Dispatch<React.SetStateAction<Boolean>>;
  onConfirm: React.Dispatch<React.SetStateAction<Boolean>>;
}

function LogoutPopUp({ onConfirm, onCancel }: Props) {
  return (
    { onConfirm } && (
      <div className="popup">
        <div className="popup-inner">
          <button className="close-btn" onClick={() => onCancel(false)}>
            Cancel
          </button>
          <Link to={"/login"}>
            <button onClick={() => onConfirm(true)}>
              Confirm
            </button>
          </Link>
        </div>
      </div>
    )
  );
}

export default LogoutPopUp;
