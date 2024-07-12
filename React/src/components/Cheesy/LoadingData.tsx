import React from "react";

function LoadingData() {
  return (
    // <div className="loader"></div>

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div className="loader"></div>
    </div>
  );
}

export default LoadingData;
