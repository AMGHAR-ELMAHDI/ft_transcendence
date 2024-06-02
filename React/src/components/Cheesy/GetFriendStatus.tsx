import { useEffect, useState } from "react";
import api from "../../api";

function GetFriendStatus(Username: string) {
  let friends: any = {};
  let retu: boolean = false;

  const getFriends = async () => {
    try {
      const response = await api.get("player/friends/");
      friends = response.data?.friends;
    } catch (error) {
      console.log(error);
    }
  };

  getFriends();

  if (Array.isArray(friends) && friends?.length) {
    friends?.map((friend: any) => {
      if (friend.username == Username) retu = true;
    });
  }

  if (
    localStorage.getItem(`FriendPending user1-${Username}`) == "P" ||
    localStorage.getItem(`FriendPending ${Username}-user1`) == "P"
  )
    retu = true;

  return retu;
}

export default GetFriendStatus;
