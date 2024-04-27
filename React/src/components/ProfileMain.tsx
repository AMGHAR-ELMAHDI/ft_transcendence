import ProfileHistory from "./ProfileHistory";
import ProfileItems from "./ProfileItems";
import History from "./History";

interface ProfileMainProps {
  inRender: string;
}

function ProfileMain({ inRender }: ProfileMainProps) {
  var toRender = <History />;

  if (inRender === "Items") toRender = <ProfileItems />;
  else if (inRender === "Trophies") toRender = <ProfileItems />;

  return <div id="ProfileHistory">{toRender}</div>;
}

export default ProfileMain;
