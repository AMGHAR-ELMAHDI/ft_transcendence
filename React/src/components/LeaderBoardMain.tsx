import Data from "../Data/LeaderBoardData.json";

function LeaderBoardMain() {
  const LeaderBoardData = Data;

  return (
    <div className="LeaderBoardContainer">
      <h1>LEADERBOARD</h1>
      <div className="Top3">
        <div className="First">
            <img src={LeaderBoardData.LeaderBoard[0].picture} alt="FirstPic" />
            <h1>{LeaderBoardData.LeaderBoard[0].username}</h1>
        </div>
        <div className="Second"></div>
        <div className="Third"></div>
      </div>
      <ul>
        {LeaderBoardData.LeaderBoard.map((user) => (
          <li key={user.id}>
            <p>Username: {user.username}</p>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Level: {user.level}</p>
            <p>Coins: {user.coins}</p>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaderBoardMain;
