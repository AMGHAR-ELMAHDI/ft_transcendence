export function getPageName() {
  let pageName = window.location.pathname;

  if (window.location.pathname?.includes("/profile/")) return "User Profile";
  if (window.location.pathname?.includes("/game")) return "";
  pageName = pageName.slice(1);
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return pageName;
}

function GetGreeting() {
  let currentHour = new Date().getHours();

  let print;
  if (currentHour < 12) print = <h1>Good Morning,</h1>;
  else if (currentHour < 18) print = <h1>Good Afternoon,</h1>;
  else print = <h1>Good Evening,</h1>;
  return print;
}
export default GetGreeting;
