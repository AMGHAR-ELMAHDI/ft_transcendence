import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";

function ShopContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <ShopDesign />
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ShopContainer;

function GetPaddle() {
  return (
    <>
      <div className="Paddles item">
        <h1 id="Paddles-header">Paddles</h1>
        <div className="Paddle-holder">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
}

function GetBackground() {
  return (
    <>
      <div className="Background item">
        <h1 id="Paddles-header">Backgrounds</h1>
        <div className="Paddle-holder">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
}

function GetAvatar() {
  return (
    <>
      <div className="Avatar item">
        <h1 id="Paddles-header">Avatars</h1>
        <div className="Paddle-holder">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
}

function ShopDesign() {
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="Header-shop">
            <h1 id="First-header">SHOP</h1>
          </div>
          <div className="Items">
            <GetPaddle />
            <GetBackground />
            <GetAvatar />
          </div>
        </div>
      </div>
    </>
  );
}

function Card() {
  return (
    <>
      <div className="Card-container">
        <div className="Item-img"></div>
        <div className="Item-value">
          <div className="Item-title">here</div>
          <div className="Item-price">20$</div>
        </div>
      </div>
    </>
  );
}
