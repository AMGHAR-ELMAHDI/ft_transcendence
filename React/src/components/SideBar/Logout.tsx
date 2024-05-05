import React from "react";
import { Link } from "react-router-dom";

interface Props {
  onCancel: React.Dispatch<React.SetStateAction<Boolean>>;
  onConfirm: React.Dispatch<React.SetStateAction<Boolean>>;
}

function LogoutPopUp({ onConfirm, onCancel }: Props) {
  return (
    // { onConfirm } && (
      <div className="popup">
        <div className="popup-inner">
          <h1>Oh no! You're leaving...</h1>
          <h1>ARE YOU SURE?</h1>
          <div className="popup-btn-container">
            <button className="pop-btn" onClick={() => onCancel(false)}>
              Cancel
            </button>
            <Link to={"/login"}>
              <button className="pop-btn pop-leave" onClick={() => onConfirm(true)}>
                Confirm
              </button>
            </Link>
          </div>
        </div>
      </div>
    // )
  );
}

export default LogoutPopUp;
