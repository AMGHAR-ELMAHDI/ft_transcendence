import React from "react";

function ProfileSideBar() {
  let color = "#757889";
  if (window.location.pathname === "/profile") color = "#1D90F5";
  return (
    <div className="sidebarImgs">
      <svg
        width="50"
        height="50"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 2.86523C25.5554 2.86523 32.0833 9.28039 32.0833 17.1919C32.0833 25.1033 25.5554 31.5185 17.5 31.5185"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M13.1248 30.8022C11.3918 30.2224 9.76385 29.3848 8.34591 28.2896M8.34591 6.09422C9.76385 5.01505 11.3918 4.16139 13.1248 3.58154M2.9165 14.6791C3.23161 13.0201 3.87928 11.4094 4.80706 9.94369M2.9165 19.7046C3.23161 21.3636 3.87928 22.9742 4.80706 24.44"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6665 23.6391C14.689 20.4901 20.2781 20.342 23.3332 23.6391M20.7343 13.9686C20.7343 15.7488 19.2812 17.1921 17.4889 17.1921C15.6965 17.1921 14.2435 15.7488 14.2435 13.9686C14.2435 12.1883 15.6965 10.7451 17.4889 10.7451C19.2812 10.7451 20.7343 12.1883 20.7343 13.9686Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default ProfileSideBar;
