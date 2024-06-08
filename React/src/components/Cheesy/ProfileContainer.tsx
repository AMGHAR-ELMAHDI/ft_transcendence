import Profile from "./Profile";
import ProfileMain from "./ProfileMain";
import { useState } from "react";

function ProfileContainer() {
  const [render, setRender] = useState<string>("History");
  return (
    <>
      <Profile profileList="RenderList" show={render} setRender={setRender} />
      <ProfileMain inRender={render} UseUserData={false} />
    </>
  );
}

export default ProfileContainer;
