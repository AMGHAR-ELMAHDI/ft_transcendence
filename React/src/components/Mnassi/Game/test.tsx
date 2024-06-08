import { useContext, useEffect, useState } from "react";
import { PlayerId } from "./contexts/PlayerId";

function userGame() {
  const [index, SetId] = useState(0);
  const value = useContext(PlayerId);

  useEffect(() => {
    let index = value;
    const objsocket = new WebSocket("ws://localhost:2500/ws/game/tn/");

    objsocket.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data?.type === "identify") {
        if (index === 0) {
          index = data?.player;
          SetId(index);
        }
        console.log(value);
      }
    };
  }, []);
  return index !== 0 ? (
    <PlayerId.Provider value={index}>
      {
        <div>
          <p className="st">{index}</p>
          {/* {Exit && <_tournament NetType='fill' Winner={Winner} />} */}
        </div>
      }
    </PlayerId.Provider>
  ) : (
    ""
  );
}

export default userGame;
