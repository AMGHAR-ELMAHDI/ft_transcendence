import ProfileItems from "./ProfileItems";
import History from "./History";
import ProfileAcheivements from "./ProfileAcheivements";
import ProfileFriends from "./ProfileFriends";

interface ProfileMainProps {
  inRender: string;
  UserData?: {
    username: string;
    first_name: string;
    last_name: string;
    image: string;
    level: number;
    coins: number;
    email: string;
    win_rate: number;
    achievements_rate: number;
    games: [];
    items: [];
    acheivments: [];
  };
  UseUserData: boolean;
}


function ProfileMain({ inRender, UserData, UseUserData }: ProfileMainProps) {
  let toRender = <History UserData={UserData} UseUserData={UseUserData} />;

  if (inRender === "Items")
    toRender = <ProfileItems UserData={UserData} UseUserData={UseUserData} />;
  else if (inRender === "Trophies")
    toRender = (
      <ProfileAcheivements UserData={UserData} UseUserData={UseUserData} />
    );
  else if (inRender === "Friends") toRender = <ProfileFriends />;

  return <div id="ProfileHistory">{toRender}</div>;
}

export default ProfileMain;
