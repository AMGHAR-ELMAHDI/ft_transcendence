import { useEffect, useState } from "react";
import PlayersReady from "./Game";
import _tournament from "./tournament";
import axios from "axios";
import "./interface.css";
import _Queue from "./inQueue";
import _title from "./title";
import { RecoilRoot } from "recoil";
import { useNavigate } from "react-router-dom";
import PopUp from "./popUp";
import toast from "react-hot-toast";

interface LocalGameProps {
  Type: string;
  Name: string;
  Name2: string;
}

function GameInterface_({ Type, Name, Name2 }: LocalGameProps) {
  return (
    <>
      {<_title title={Name + " vs " + Name2}></_title>}
      <div className="game">
        <div className="play"></div>
        <div className="score" id="score">
          <p id="Pscore">0</p>
          <p id="Sscore">0</p>
        </div>
        <div className="winner" id="winner"></div>
        <canvas id="canvas"></canvas>
      </div>
    </>
  );
}

function InvitedUsers({ Type, Name, Name2 }: LocalGameProps) {
  interface Vector {
    x: number;
    y: number;
  }

  interface Paddles {
    pos: Vector;
    velocity: Vector;
    height: number;
    width: number;
    score: number;
    player: string;
    HalfWidth(): number;
    HalfHeight(): number;
    GetCenter(): Vector;
  }

  interface Ball {
    pos: Vector;
    velocity: Vector;
    radius: number;
  }

  const [DataReady, StatusCode] = useState<boolean>(false);
  const [Exit, setExit] = useState<boolean>(false);
  const [achi, SetAchievement] = useState<boolean>(false);
  const [array, setArray] = useState<any>([]);

  const navigate = useNavigate();

  useEffect(() => {
    var room_group_name = "";
    var index = -1;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    let StopGame = false;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const Fscore = document.getElementById("Pscore");
    const Sscore = document.getElementById("Sscore");
    const winner = document.getElementById("winner");
    const score = document.getElementById("score");
    const context = canvas.getContext("2d");

    const KeyPressed: any[] = [];

    window.addEventListener("keydown", function (e) {
      KeyPressed[e.keyCode] = true;
    });
    window.addEventListener("keyup", function (e) {
      KeyPressed[e.keyCode] = false;
    });
    function changeCanvasSize(newWidth: number, newHeight: number) {
      canvas.width = newWidth;
      canvas.height = newHeight;
    }
    function FillColor(color: string) {
      context!.fillStyle = color;
    }
    function TwoVect(x: number, y: number) {
      return { x: x, y: y };
    }

    changeCanvasSize(1359, 841);

    function Paddles(
      this: any,
      pos: Vector,
      velocity: Vector,
      width: number,
      height: number
    ): void {
      this.pos = pos;
      this.velocity = velocity;
      this.width = width;
      this.height = height;
      this.player = "";
      this.radius = 20;
      this.score = 0;

      this.draw = function () {
        context!.beginPath();
        context!.moveTo(this.pos.x + this.radius, this.pos.y);
        context!.arcTo(
          this.pos.x + width,
          this.pos.y,
          this.pos.x + width,
          this.pos.y + height,
          this.radius
        );
        context!.arcTo(
          this.pos.x + width,
          this.pos.y + height,
          this.pos.x,
          this.pos.y + height,
          this.radius
        );
        context!.arcTo(
          this.pos.x,
          this.pos.y + height,
          this.pos.x,
          this.pos.y,
          this.radius
        );
        context!.arcTo(
          this.pos.x,
          this.pos.y,
          this.pos.x + width,
          this.pos.y,
          this.radius
        );
        context!.closePath();
        context!.fillStyle = "white";
        context?.fill();
        context!.strokeStyle = "white";
        context?.stroke();
      };
      this.HalfWidth = function () {
        return this.width / 2;
      };
      this.HalfHeight = function () {
        return this.height / 2;
      };
      this.GetCenter = function () {
        return TwoVect(
          this.pos.x + this.HalfWidth(),
          this.pos.y + this.HalfHeight()
        );
      };
    }

    function Ball(this: any, pos: Vector, velocity: Vector, radius: number) {
      this.pos = pos;
      this.velocity = velocity;
      this.radius = radius;

      this.update = function () {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
      };
      this.draw = function () {
        FillColor("#ffffff");
        context?.beginPath();
        context?.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        context?.fill();
      };
    }

    const ball = new (Ball as any)(TwoVect(67, 67), TwoVect(7, 7), 10);

    const paddle1 = new (Paddles as any)(
      TwoVect(0, 50),
      TwoVect(5, 5),
      20,
      160
    );
    const paddle2 = new (Paddles as any)(
      TwoVect(canvas.width - 20, 20),
      TwoVect(5, 5),
      20,
      160
    );

    function Score(ScorePlayer1: string, ScorePlayer2: string) {
      // let animation first
      Sscore!.innerHTML = ScorePlayer2;
      Fscore!.innerHTML = ScorePlayer1;
      paddle1.score = ScorePlayer1;
      paddle2.score = ScorePlayer2;
    }

    function winGame(paddle: Paddles) {
      StopGame = true;
      score!.style.display = "none";
      canvas!.style.cursor = "default";
      winner!.style.opacity = "1";
      objSocket.send(
        JSON.stringify({
          type: "it_ends_now",
          room: room_group_name,
          winner: paddle.player,
        })
      );
    }

    function BallSettings(paddle1: Paddles, paddle2: Paddles) {
      if (paddle1.score >= 7) winGame(paddle1);
      if (paddle2.score >= 7) winGame(paddle2);
    }

    function connectBackend() {
		const token = localStorage.getItem('token')
		const invite_id = localStorage.getItem("invite_id");
		const url = `wss://localhost:2500/ws/start-single-game/${token}/${invite_id}`;
		return new WebSocket(url);
    }

    function isWebSocketConnected(): boolean {
      return objSocket && objSocket.readyState === WebSocket.OPEN;
    }

    const objSocket = connectBackend();

    objSocket.onopen = function () {
      objSocket.send(
        JSON.stringify({
          type: "canvas",
          CanWidth: canvas.width,
          CanHeight: canvas.height,
        })
      );
    };

    objSocket!.onmessage = function (e) {
      const data = JSON.parse(e.data);

      if (data?.type == "identify") {
        index = data?.player;
        room_group_name = data?.roomId;
        if (Name == data?.name && index == 1) {
          paddle1.player = Name;
          paddle2.player = Name2;
        } else {
          paddle1.player = Name;
          paddle2.player = Name2;
        }
      }
      if (data?.message?.type == "ballPos") {
        ball.pos.x = data?.message?.BallX;
        ball.pos.y = data?.message?.BallY;
      }
      if (data?.message?.type == 'earnedAch' && data?.message?.index === index) {
        console.log('lool')
        // setArray(data?.message)
        // SetAchievement(true)
        toast.success('new achievement unlocked')
      }
      if (
        data?.message?.type === "paddleChan" &&
        data?.message?.index === "1"
      ) {
        paddle1.pos.x = data?.message?.posX;
        paddle1.pos.y = data?.message?.posY;
      }
      if (
        data?.message?.type === "paddleChan" &&
        data?.message?.index === "2"
      ) {
        paddle2.pos.x = data?.message?.posX;
        paddle2.pos.y = data?.message?.posY;
      }
      if (data?.message?.type === "scored") {
        Score(data?.message?.scorePlayer1, data?.message?.scorePlayer2);
        BallSettings(paddle1, paddle2);
      }
      if (data?.message?.type === "finals") {
        winner!.innerHTML = data?.message?.winner
        setTimeout(()=> navigate('/'), 1000)
      }
      if (isWebSocketConnected() && KeyPressed[KEY_UP]) {
        objSocket.send(
          JSON.stringify({
            type: "paddleUpdates",
            user: index.toString(),
            key: "up",
          })
        );
      }
      if (isWebSocketConnected() && KeyPressed[KEY_DOWN]) {
        objSocket.send(
          JSON.stringify({
            type: "paddleUpdates",
            user: index.toString(),
            key: "down",
          })
        );
      }
    };

    function GameDraw() {
      ball.draw();
      paddle1.draw();
      paddle2.draw();
    }

    function GameLoop() {
      if (StopGame) return;
      context?.clearRect(0, 0, canvas.width, canvas.height);
      window.requestAnimationFrame(GameLoop);

      GameDraw();
    }

    GameLoop();
  }, []);
  return (
    // send the two palyers to tn file
    <>
      {achi && <PopUp title={array.title} image={array.image} descr={array.description} />}
      {!Exit && (
        <GameInterface_ Type="" Name={Name} Name2={Name2} />
      )}
    </>
  );
}

export default InvitedUsers;
