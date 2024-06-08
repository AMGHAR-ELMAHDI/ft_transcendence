import { useEffect } from "react";
import api from "../../api";

interface Props {
  UserName: string;
  UserId: number;
}

function AddFriend({ UserName, UserId }: Props) {
  const putData = async () => {
    try {
      const response = await api.post("reqs/", {
        to_user: UserId,
        status: "P",
      });
    } catch (error) {
      console.log(error);
    }
  };
  putData();
}

export default AddFriend;
