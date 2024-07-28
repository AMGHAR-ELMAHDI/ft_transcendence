import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TournamentList.css";
import api from "../../../api";

interface Props {
  players: string;
  room_name: string;
  onJoin: (room_name: string) => void;
}

function TnList({ players, room_name, onJoin }: Props) {
  return (
    <>
      <div className="card">
        <img src="/vs4.png" alt="" className="img-card" />
        <div className="tnName">
          <h1>{room_name}</h1>
        </div>
        {players == "4" && (
          <div className="bottomTa">
            <div className="IndexPlayers notAv">{players || "1"}/4</div>
            <div className="btn- notAv" onClick={() => onJoin(room_name)}>
              join
            </div>
          </div>
        )}
        {players != "4" && (
          <div className="bottomTa">
            <div className="IndexPlayers">{players || "1"}/4</div>
            <div className="btn-" onClick={() => onJoin(room_name)}>
              join
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Filler() {
  const navigate = useNavigate();
  const [array, SetArray] = useState<any>([]);

  const HandleClick = (room_name: string) => {
    navigate(`/game/gameplay?room_name=${room_name}`);
  };

  useEffect(() => {
    const btn_cr = document.querySelector(".btn-cr");
    const btn_Tn = document.querySelector(".btn-createTn button");
    const input_v: HTMLInputElement = document.querySelector(".room_input")!;

    btn_Tn?.addEventListener("click", () => {
      document.querySelector(".cards")?.classList.add("blurIt");
      document.querySelector(".create-option")?.classList.add("show");
    });

    function CheckSpecialChars(input: any) {
      const SpecialCharacters = "'\"!@#$%^&*()_+=-][{};:?/>.<,`~";

      for (let i = 0; i < SpecialCharacters.length; i++) {
        if (input.includes(SpecialCharacters[i])) return true;
      }
      return false;
    }

    btn_cr?.addEventListener("click", () => {
      const v_ = input_v.value;
      const rs = CheckSpecialChars(v_);
      if (v_ !== "" && !rs) HandleClick(input_v.value);
      else if (v_ === "") {
        input_v.classList.add("error_");
        setTimeout(() => input_v.classList.remove("error_"), 1000);
      }
    });

    api.get("getTournaments/").then((response) => {
      SetArray(response.data);
    });
  }, []);
  return (
    <>
      <div className="alltnGames">
        <div className="create-option">
          <h1>Tournament</h1>
          <input className="room_input" type="text" placeholder="room name" />
          <button className="btn-cr">create</button>
        </div>
        <div className="btn-createTn">
          <button>create or join one</button>
        </div>
        <div className="cards">
          {array.map((element: any, index: any) => {
            if (element.fields.status == "S" || element.fields.status == "Q")
              return (
                <TnList
                  key={index}
                  players={element.fields.players}
                  room_name={element.fields.name}
                  onJoin={HandleClick}
                />
              );
          })}
        </div>
      </div>
    </>
  );
}

export default Filler;
