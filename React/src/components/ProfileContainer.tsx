import React from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Profile from "./Profile";
import ProfileMain from "./ProfileMain";
import FriendBar from "./FriendBar";

function ProfileContainer(render: string, setRender: any) {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <Profile
            profileList="RenderList"
            show={render}
            setRender={setRender}
          />
          <ProfileMain inRender={render} />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ProfileContainer;
