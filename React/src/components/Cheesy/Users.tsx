import React from "react";
import { useParams } from "react-router-dom";

function Users() {
  const { username } = useParams();
  console.log("Users: " + username);

  return <div>{username}</div>;
}

export default Users;
