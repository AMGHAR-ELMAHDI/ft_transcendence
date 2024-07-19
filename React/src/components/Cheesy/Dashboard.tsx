import { useNavigate } from "react-router-dom";
import ProfileHistory from "./ProfileHistory";

function Dashboard() {
  const navigate = useNavigate();
  const goToGame = () => {
    navigate("/game");
  };
  return (
    <div id="Dashboard">
      <div onClick={goToGame} id="Dashboard-Main-GameModeContainer"></div>

      <div id="Dashboard-Secondary-GameModeContainer">
        <div onClick={goToGame} id="Dashboard-Secondary-tournament"></div>
        <div onClick={goToGame} id="Dashboard-Secondary-bot"></div>
        <div onClick={goToGame} id="Dashboard-Secondary-practice"></div>
      </div>

      <div id="DashboardHistory">{ProfileHistory()}</div>
    </div>
  );
}

export default Dashboard;
