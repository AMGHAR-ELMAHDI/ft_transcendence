import { useParams } from "react-router-dom";
import Profile from "./Profile";
import ProfileMain from "./ProfileMain";
import { useState } from "react";

function ProfileContainer() {
  const [render, setRender] = useState<string>("History");
  const { username } = useParams();
  console.log("Porfile: " + username);
  return (
    <>
      <Profile profileList="RenderList" show={render} setRender={setRender} />
      <ProfileMain inRender={render} />
    </>
  );
}

export default ProfileContainer;
