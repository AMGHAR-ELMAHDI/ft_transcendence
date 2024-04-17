import React from "react";
import ProfileHistory from "./ProfileHistory";
import ProfileItems from "./ProfileItems";

interface ProfileMainProps {
  inRender: string;
}

function ProfileMain({ inRender }: ProfileMainProps) {
  var toRender = <ProfileHistory />;

	if (inRender === "Items")
		toRender = <ProfileItems />;
	else if (inRender === "Trophies")
		toRender = <ProfileItems />;

  return (
    <div id="ProfileHistory">
      {toRender}
    </div>
  );
}

export default ProfileMain;
