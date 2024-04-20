function LogOutSideBar() {
  let color = "white";
  if (window.location.pathname === "/logout") color = "#1D90F5";
  return (
    <div className="sidebarImgs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ionicon sidebarImgs"
        viewBox="0 0 512 512"
      >
        <path
          d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
    </div>
  );
}

export default LogOutSideBar;
