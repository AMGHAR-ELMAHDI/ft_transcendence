import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { setAuthToken } from "../Utils/setAuthToken";
import "react-circular-progressbar/dist/styles.css";
import ProfileMain from "./ProfileMain";
import api from "../../api";
import Profile from "./Profile";
import UserProfile from "./UserProfile";
import Username from "../../Atoms/Username";
import { useRecoilValue } from "recoil";

function Users() {
  const [render, setRender] = useState<string>("History");
  const username = useRecoilValue(Username);

  const UserData: any = useLoaderData();
  const myProfile: boolean = UserData?.username == username ? true : false;

  if (UserData === null) {
    return (
      <>
        <Profile profileList="RenderList" show={render} setRender={setRender} />
        <ProfileMain inRender={render} UseUserData={false} />
      </>
    );
  }

  return (
    <>
      <UserProfile
        show={render}
        setRender={setRender}
        data={UserData}
        myProfile={myProfile}
      />
      <ProfileMain inRender={render} UserData={UserData} UseUserData={true} />
    </>
  );
}

export const UsersLoader = async ({ params }: { params: any }) => {
  const { username } = params;

  setAuthToken();
  try {
    const response = await api.get(`player/${username}/me/`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default Users;
