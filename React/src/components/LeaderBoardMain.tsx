import Data from "../Data/LeaderBoardData.json";

function getTop3() {
  const LeaderBoardData = Data;
  // <h1>Level {LeaderBoardData.LeaderBoard[0].level}</h1>
  return (
    <div className="Top3">
      <div className="First">
        <img className="topImgs" src={LeaderBoardData.LeaderBoard[0].picture} alt="FirstPic" />
        <h1 className="toph1">{LeaderBoardData.LeaderBoard[0].username}</h1>
        <div className="Coins"><h2>200 Coins</h2><h3 className="prize">Prize</h3></div>
      </div>
      <div className="SecondThird">
        <div className="Second">
          <img className="topImgs" src={LeaderBoardData.LeaderBoard[1].picture} alt="FirstPic" />
          <h1 className="toph1">{LeaderBoardData.LeaderBoard[1].username}</h1>
          <div className="Coins"><h2>100 Coins</h2><h3 className="prize">Prize</h3></div>
        </div>
        <div className="Third">
          <img className="topImgs" src={LeaderBoardData.LeaderBoard[2].picture} alt="FirstPic" />
          <h1 className="toph1">{LeaderBoardData.LeaderBoard[2].username}</h1>
          <div className="Coins"><h2>50 Coins</h2><h3 className="prize">Prize</h3></div>
        </div>
      </div>
    </div>
  );
}

function getTheRest() {
  const LeaderBoardData = Data;
  return (
    <div className="LeaderBoardRest">
      <ul>
        {LeaderBoardData.LeaderBoard.map((user) => (
          <li key={user.id} id={user.id.toString()}>
            <p>Username: {user.username}</p>
            <p>Level: {user.level}</p>
            <p>Coins: {user.coins}</p>
            <br />
          </li>
        ))}
      </ul>
    </div>
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
