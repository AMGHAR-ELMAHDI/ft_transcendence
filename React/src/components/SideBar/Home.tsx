import React from "react";

function Home() {
  let color = "white";
  if (window.location.pathname === "/") color = "#1D90F5";
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.2149 6.91437L4.7237 14.2138C3.99554 14.8398 4.48376 15.9516 5.4868 15.9516C6.09961 15.9516 6.59639 16.4023 6.59639 16.9585V21.6053C6.59639 25.603 6.59639 27.6019 7.96507 28.8438C9.33376 30.0858 11.5366 30.0858 15.9424 30.0858H19.0576C23.4634 30.0858 25.6662 30.0858 27.0349 28.8438C28.4037 27.6019 28.4037 25.603 28.4037 21.6053V16.9585C28.4037 16.4023 28.9004 15.9516 29.5132 15.9516C30.5162 15.9516 31.0045 14.8398 30.2763 14.2138L21.785 6.91437C19.7559 5.17003 18.7413 4.29785 17.5 4.29785C16.2587 4.29785 15.2441 5.17003 13.2149 6.91437Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.5 22.9229H17.5131"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Home;
