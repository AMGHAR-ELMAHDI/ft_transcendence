import React, { useEffect, useState } from "react";
import { setAuthToken } from "../Utils/setAuthToken";
import api from "../../api";
import Typed from "typed.js";

const data = [
  {
    id: 1,
    type: "G",
    name: "Blue-Table",
    price: "100.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Backgrounds/Blue-Table.png?raw=true",
  },
  {
    id: 2,
    type: "G",
    name: "Green-Table",
    price: "900.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Backgrounds/Green-Table.png?raw=true",
  },
  {
    id: 3,
    type: "G",
    name: "Grey-Table",
    price: "600.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Backgrounds/Grey-Table.png?raw=true",
  },
  {
    id: 4,
    type: "G",
    name: "Orange-Table",
    price: "700.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Backgrounds/Orange-Table.png?raw=true",
  },
  {
    id: 5,
    type: "G",
    name: "Red-Table",
    price: "600.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Backgrounds/Red-Table.png?raw=true",
  },
  {
    id: 6,
    type: "B",
    name: "blue-ball",
    price: "800.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Balls/blue-ball.png?raw=true",
  },
  {
    id: 7,
    type: "B",
    name: "orange-ball",
    price: "700.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Balls/orange-ball.png?raw=true",
  },
  {
    id: 8,
    type: "B",
    name: "purple-ball",
    price: "800.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Balls/purple-ball.png?raw=true",
  },
  {
    id: 9,
    type: "B",
    name: "red-ball",
    price: "100.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Balls/red-ball.png?raw=true",
  },
  {
    id: 10,
    type: "B",
    name: "yellow-ball",
    price: "100000.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Balls/yellow-ball.png?raw=true",
  },
  {
    id: 11,
    type: "P",
    name: "blue-paddle",
    price: "100.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Paddles/blue-paddle.png?raw=true",
  },
  {
    id: 12,
    type: "P",
    name: "orange-paddle",
    price: "900.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Paddles/orange-paddle.png?raw=true",
  },
  {
    id: 13,
    type: "P",
    name: "purple-paddle",
    price: "600.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Paddles/purple-paddle.png?raw=true",
  },
  {
    id: 14,
    type: "P",
    name: "red-paddle",
    price: "700.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Paddles/red-paddle.png?raw=true",
  },
  {
    id: 15,
    type: "P",
    name: "yellow-paddle",
    price: "600.00",
    path: "https://github.com/AMGHAR-ELMAHDI/Transcendance-Images/blob/master/Items/Paddles/yellow-paddle.png?raw=true",
  },
];

interface Props {}

function ChangeItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setAuthToken();
    const getowned = async () => {
      try {
        const response = await api.get("player/items/");
        setItems(response.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    getowned();
    const emptyDataElement = document.querySelector(".emptyData");
    if (emptyDataElement) {
      const typed = new Typed(emptyDataElement, {
        strings: ["No Owened Items!!", "Visit The Shop To Get Some!!"],
        typeSpeed: 50,
        startDelay: 400,
        loop: true,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  // if (!items.length)
  //   return (
  //     <div className="textContainer">
  //       <h1 className="emptyData"></h1>
  //     </div>
  //   );

  return (
    <div className="settingsItems">
      {data.map((item: any) => (
        <h1 key={item?.id}>{item?.name}</h1>
      ))}
    </div>
  );
}

export default ChangeItems;
