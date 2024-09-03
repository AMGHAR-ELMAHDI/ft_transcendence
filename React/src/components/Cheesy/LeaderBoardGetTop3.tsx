import { useRecoilValue } from "recoil";
import LeaderData from "../../Atoms/LeaderData";
import { useNavigate } from "react-router-dom";
import Url from "../../Atoms/Url";

export function GetCorrect(image: string, url: string) {
  let correctImage: string = image;

  if (image?.includes("/media/https%3A/cdn.intra.42.fr"))
    correctImage = "https://" + image.substring(16);
  else if (image?.includes("https://cdn.intra.42.fr/")) correctImage = image;
  else if (image == "/media/images/default.png") {
    correctImage = url + image.substring(1);
  } else if (
    image?.includes(import.meta.env.VITE_API_URL + "media/media/store/")
  )
    correctImage = url + image.slice(28);
  else if (image?.includes("/media/media/store/"))
    correctImage = url + image.slice(7);
  else if (image?.includes("/media/store/images/"))
    correctImage = url.slice(0, url.length - 1) + image;
  else if (image?.includes("media/store/")) correctImage = url + image;
  else if (image?.includes("/media/"))
    correctImage = url.slice(0, url.length - 1) + image;
  else correctImage = url + "media/" + image;

  return correctImage;
}

function LeaderBoardGetTop3() {
  const leaderBoardData = useRecoilValue(LeaderData);
  const url = useRecoilValue(Url);

  const top3: any = leaderBoardData.slice(0, 3);
  const navigate = useNavigate();

  if (top3?.length < 3) return <h1>There aren't Enough PLayers</h1>;
  return (
    <div className="Top3">
      <div
        className="First"
        onClick={() => navigate(`/profile/${top3[0]?.username}`)}
      >
        <div className="topImgsContainer">
          <img
            className="topImgs"
            src={GetCorrect(top3[0]?.image, url)}
            alt={top3[0]?.username + "picture"}
          />
        </div>
        <h1 className="toph1 Panton">{top3[0]?.username}</h1>
      </div>
      <div className="SecondThird">
        <div
          className="Second"
          onClick={() => navigate(`/profile/${top3[1]?.username}`)}
        >
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={GetCorrect(top3[1]?.image, url)}
              alt={top3[1]?.username + "picture"}
            />
          </div>
          <h1 className="toph1 Panton">{top3[1]?.username}</h1>
        </div>
        <div
          className="Third"
          onClick={() => navigate(`/profile/${top3[2]?.username}`)}
        >
          <div className="topImgsContainer">
            <img
              className="topImgs"
              src={GetCorrect(top3[2]?.image, url)}
              alt={top3[2]?.username + "picture"}
            />
          </div>
          <h1 className="toph1 Panton">{top3[2]?.username}</h1>
        </div>
      </div>
    </div>
  );
}
export default LeaderBoardGetTop3;
