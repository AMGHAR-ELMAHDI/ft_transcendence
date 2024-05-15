import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import UsersName from "../../Atoms/UsersName";


function Users() {
  const username: string = useRecoilValue(UsersName);
  console.log("Users: " + username);

  return <div>{username}</div>;
}

export default Users;
