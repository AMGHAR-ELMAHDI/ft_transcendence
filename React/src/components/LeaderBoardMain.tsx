import Data from "../Data/LeaderBoardData.json";

function getTop3() {
  const LeaderBoardData = Data;
  return (
    <div className="Top3">
      <div className="First">
        <img src={LeaderBoardData.LeaderBoard[0].picture} alt="FirstPic" />
        <h1>{LeaderBoardData.LeaderBoard[0].username}</h1>
        <h1>Level {LeaderBoardData.LeaderBoard[0].level}</h1>
        <h1>{LeaderBoardData.LeaderBoard[0].coins}</h1>
      </div>
      <div className="SecondThird">
        <div className="Second">
          <img src={LeaderBoardData.LeaderBoard[1].picture} alt="FirstPic" />
          <h1>{LeaderBoardData.LeaderBoard[1].username}</h1>
          <h1>Level {LeaderBoardData.LeaderBoard[1].level}</h1>
          <h1>{LeaderBoardData.LeaderBoard[1].coins}</h1>
        </div>
        <div className="Third">
          <img src={LeaderBoardData.LeaderBoard[2].picture} alt="FirstPic" />
          <h1>{LeaderBoardData.LeaderBoard[2].username}</h1>
          <h1>Level {LeaderBoardData.LeaderBoard[2].level}</h1>
          <h1>{LeaderBoardData.LeaderBoard[2].coins}</h1>
        </div>
      </div>
    </div>
  );
}

function getTheRest() {
  const LeaderBoardData = Data;
  return (
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
  );
}

function LeaderBoardMain() {
  return (
    <div className="LeaderBoardContainer">
      <h1>LEADERBOARD</h1>
      {getTop3()}
      {getTheRest()}
    </div>
  );
}

export default LeaderBoardMain;

// {
//   "id": 5,
//   "user_id": 3,
//   "username": "Buda",
//   "picture" : "https://source.unsplash.com/featured/300x201",
//   "coins": 50,
//   "level": 5,
//   "first_name": "yahya",
//   "last_name": "taqsi"
// },
// {
//   "id": 6,
//   "user_id": 3,
//   "username": "zmoumni",
//   "picture" : "https://source.unsplash.com/featured/300x201",
//   "coins": 50,
//   "level": 5,
//   "first_name": "zakaria",
//   "last_name": "moumni"
// },
// {
//   "id": 7,
//   "user_id": 3,
//   "username": "jmou7i",
//   "picture" : "https://source.unsplash.com/featured/300x201",
//   "coins": 50,
//   "level": 5,
//   "first_name": "ayman",
//   "last_name": "Msaoub"
// },
// {
//   "id": 7,
//   "user_id": 3,
//   "username": "GamerGirl",
//   "picture" : "https://source.unsplash.com/featured/300x201",
//   "coins": 50,
//   "level": 5,
//   "first_name": "Yassmine",
//   "last_name": "Makhlouf"
// }
