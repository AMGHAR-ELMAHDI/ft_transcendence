import _game2D from "./interface";
import _UserViews from "./view";
import _multiplayer2 from "./multiplayer2";
import _multiplayer from "./multiplayer";
import _tournament from "./tournament";
import _buttons from "./buttons";
import _Animation from "./animation";
import _LocTn from "./LocTn";
import _mods from "./mods";
import _title from "./title";
import _Queue from "./inQueue";
import TestingTn from "./TournamentList";
import { useEffect, useState } from "react";

function Options() {
  const [type, setMod] = useState<string>("");

  useEffect(() => {
    const btn = document?.getElementById("mods");
    const mods = document?.querySelectorAll(".Imods");

    const btn_mods = document.querySelector('.btn-moded')
		btn_mods?.addEventListener('click', ()=> {
      const mods = document?.querySelector('.mod_Cont')
			mods?.classList.add('showMods_')
		})

    btn?.addEventListener("click", () => {
      setMod("");
    });
    mods.forEach((mod) => {
      mod?.addEventListener("click", () => {
        setMod(mod.id);
      });
    });
  });
  return type === "0" ? (
    <div>
      <_title title="local game" />
      <_multiplayer2 type="" Name1="PLAYER1" Name2="PLAYER2" />
    </div>
  ) : type === "1" ? (
    <div>
      <_title title="local vs bot" />
      <_game2D />
    </div>
  ) : type === "2" ? (
    <div>
      <TestingTn />
    </div>
  ) : type === "3" ? (
    <div>
      {/* <_title title="Local Tournament" /> */}
      <_LocTn />
    </div>
  ) : (
    <div>
      <_title title="Overview" />
      <_UserViews />
      <_mods />
      <_buttons/>
    </div>
  );
}

function Game() {
  return <Options />;
}

export default Game;
