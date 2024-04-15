import React from "react";
import ProfileHistory from "./ProfileHistory";
import ProfileItems from "./ProfileItems";

interface ProfileMainProps {
  render: string;
}

function ProfileMain({ render }: ProfileMainProps) {
  var toRender = <ProfileHistory />;

	if (render === "Items")
		toRender = <ProfileItems />;
	else if (render === "Trophies")
		toRender = <ProfileItems />;

  return (
    <div id="ProfileHistory">
      {toRender}
    </div>
  );
}

export default ProfileMain;
