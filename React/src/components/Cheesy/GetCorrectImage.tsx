import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";

function GetCorrectImage(image: string) {
  const url = useRecoilValue(Url);
  let correctImage = image;


  if (image?.includes("/media/store/images/")) {
    correctImage = url.slice(0, url.length - 1) + image;
  } else if (image?.includes("http://localhost:2500/media/media/store/")) {
    correctImage = image?.replace("http://localhost:2500/media/media/", url);
  } else if (image?.includes("/media/media/store/"))
    correctImage = url + image.slice(7);

  return correctImage;
}

export default GetCorrectImage;
