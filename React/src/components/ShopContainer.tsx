import SideBar from "./SideBar";
import TopBar from "./TopBar";
import FriendBar from "./FriendBar";

function ShopContainer() {
  return (
    <>
      <div className="AppClass">
        <SideBar />
        <div className="main">
          <TopBar />
          <h1></h1>
          
        </div>
        <FriendBar />
      </div>
    </>
  );
}

export default ShopContainer;
