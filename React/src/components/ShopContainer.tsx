import SideBar from "./SideBar";
import TopBar from "./TopBar";
import FriendBar from "./FriendBar";
import "../css/Shop.css";

function ShopContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="wrapper">
          <div className="Headers-Shop">
            <h1>SHOP</h1>
            <h2>Gear Up Game On</h2>
          </div>
          <div className="ItemsToBuy">
            <div className="Item-num-one">
              <div className="Item-one-pic">
                <div className="Item-one-name">
                  <p>Of Cos Cheeky Breeky</p>
                </div>
              </div>
              <div className="Item-one-value">
                <div className="Item-one-button">
                  <p>Buy</p>
                </div>
                <div className="Item-one-price-tag">
                  <p>5$</p>
                </div>
              </div>
            </div>
            <div className="Item-num-two"></div>
            <div className="Item-num-three"></div>
            <div className="Item-num-four"></div>
          </div>
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ShopContainer;
