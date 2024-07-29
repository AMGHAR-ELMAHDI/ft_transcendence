import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";

function GetCorrectImage(image: string) {
  const url = useRecoilValue(Url);
  let correctImage = image;

  if (image?.includes("/media/store/images/")) {
    correctImage = url.slice(0, url.length - 1) + image;
  } else if (
    image?.includes(import.meta.env.VITE_API_URL + "media/media/store/")
  ) {
    correctImage = image?.replace(
      import.meta.env.VITE_API_URL + "media/media/",
      url
    );
  } else if (image?.includes("/media/media/store/"))
    correctImage = url + image.slice(7);

  return correctImage;
}

export default GetCorrectImage;
