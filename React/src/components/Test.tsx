import React from "react";
import ProfileData from "../Data/Profile.json";

function Test() {
  const profileData = ProfileData;

  return (
    <div>
      <h2>User Details</h2>
      <p>Username: {profileData.username}</p>
      <p>First Name: {profileData.first_name}</p>
      <p>Last Name: {profileData.last_name}</p>
      <p>Level: {profileData.level}</p>
      <p>Win Rate: {profileData.win_rate}</p>
      <p>Trophies Rate: {profileData.trophies_rate}</p>

      <h2>Friends</h2>
      <ul>
        {profileData.friends.map((friend) => (
          <li key={friend.id}>
            <p>Username: {friend.username}</p>
            <p>First Name: {friend.first_name}</p>
            <p>Last Name: {friend.last_name}</p>
            <p>Level: {friend.level}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
