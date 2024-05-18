import { useRecoilState, useRecoilValue } from "recoil";
import ShopItems from "../../Atoms/ShopItems";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import OwnedItems from "../../Atoms/OwnedItems";

interface CardProps {
  name: string;
  price: number;
  image: string;
  id: number;
}

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

function FilterItems(ownedItems: any, name: string) {
  const Filter = ownedItems.find((obj: any) => obj.name === name);
  if (Filter) return true;
  else return false;
}

function GetPaddle() {
  const data = useRecoilValue(ShopItems);
  const paddle = data.filter((item: any) => item?.type === "P");
  return (
    <>
      <div className="Paddles item">
        <h1 id="Paddles-header">Paddles</h1>
        <div className="Paddle-holder">
          {paddle.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.path}
              id={item.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function GetBackground() {
  const data = useRecoilValue(ShopItems);
  const background = data.filter((item: any) => item?.type === "B");
  return (
    <>
      <div className="Background item">
        <h1 id="Paddles-header">Backgrounds</h1>
        <div className="Paddle-holder">
          {background.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.path}
              id={item.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function GetAvatar() {
  const data = useRecoilValue(ShopItems);
  const avatar = data.filter((item: any) => item?.type === "A");
  return (
    <>
      <div className="Avatar item">
        <h1 id="Paddles-header">Avatars</h1>
        <div className="Paddle-holder">
          {avatar.map((item: any) => (
            <Card
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.path}
              id={item.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ShopDesign() {
  const [shopItems, setShopItems] = useRecoilState(ShopItems);
  const [ownedItems, setownedItems] = useRecoilState(OwnedItems);
  //get items shop
  setAuthToken();
  const getData = async () => {
    try {
      const response = await api.get("shop/");
      setShopItems(response.data.all_items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  //get owned items
  setAuthToken();
  const getowned = async () => {
    try {
      const response = await axios.get("http://localhost:2500/player/items/");
      setownedItems(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getowned();
  }, []);
  return (
    <>
      <div className="container">
        <div className="wrapper">
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

//TODO:Add UseState to rerender the Items when bought, ADD Shake effect(green and red color)

function Card({ name, price, image, id }: CardProps) {
  const obj = {
    item_id: id,
  };
  const [purchased, setPurchased] = useState(false);
  const owned = useRecoilValue(OwnedItems);

  const item = document.querySelector("Item-img-animation");
  const handleBuy = async () => {
    try {
      const response = await axios.post("http://localhost:2500/shop/", obj);
      console.log(response.status);
      setPurchased(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (FilterItems(owned, name)) {
      setPurchased(true);
    }
  }, [owned, name]);

  return (
    <>
      <div className="Card-container">
        <div onClick={() => handleBuy()} className="Item-img">
          <div className="Item-img-animation">
            <p>BUY IT!</p>
          </div>
          <img src={image} alt="item" />
          <div className="Item-img-animation2"></div>
        </div>
        <div className="Item-value">
          <div className="Item-title">{name}</div>
          {purchased ? (
            <div className="Item-price">{"Owned"}</div>
          ) : (
            <div className="Item-price">{price + "$"}</div>
          )}
        </div>
      </div>
    </>
  );
}
