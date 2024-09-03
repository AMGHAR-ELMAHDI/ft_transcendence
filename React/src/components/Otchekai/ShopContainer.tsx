import { useRecoilState, useRecoilValue } from "recoil";
import ShopItems from "../../Atoms/ShopItems";
import FriendBar from "../Cheesy/FriendBar";
import SideBar from "../Cheesy/SideBar";
import TopBar from "../SearchBar/TopBar";
import { setAuthToken } from "../Utils/setAuthToken";
import axios from "axios";
import { useEffect, useState } from "react";
import OwnedItems from "../../Atoms/OwnedItems";
import api from "../../api";
import Url from "../../Atoms/Url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  if (!Array.isArray(ownedItems)) {
    return false;
  }

  const Filter = ownedItems.find((obj) => obj.name === name);
  return !!Filter;
}

function GetPaddle() {
  const data = useRecoilValue(ShopItems);
  const paddle = data?.filter((item: any) => item?.type === "P");
  return (
    <>
      <div className="itemsContainer">
        <h1 id="Paddles-header">Paddles</h1>
        <div className="Paddle-holder">
          {paddle?.map((item: any) => (
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
  const background = data?.filter((item: any) => item?.type === "G");
  return (
    <>
      <div className="itemsContainer">
        <h1 id="Paddles-header">Backgrounds</h1>
        <div className="Paddle-holder">
          {background?.map((item: any) => (
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
  const avatar = data?.filter((item: any) => item?.type === "B");
  return (
    <>
      <div className="itemsContainer">
        <h1 id="Paddles-header">Balls</h1>
        <div className="Paddle-holder">
          {avatar?.map((item: any) => (
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
      const response = await api.get("items/");
      setShopItems(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    getData();
  }, []);

  //get owned items
  setAuthToken();
  const getowned = async () => {
    try {
      const response = await api.get("player/items/");
      setownedItems(response.data.items);
    } catch (error) {
    }
  };

  useEffect(() => {
    getowned();
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="Items">
          <GetPaddle />
          <GetBackground />
          <GetAvatar />
        </div>
      </div>
    </>
  );
}

//TODO:Add UseState to rerender the Items when bought, ADD Shake effect(green and red color)
function Card({ name, price, image, id }: CardProps) {
  const navigate = useNavigate();

  const obj = {
    item_id: id,
  };
  const [purchased, setPurchased] = useState(false);
  const owned = useRecoilValue(OwnedItems);
  const url = useRecoilValue(Url);

  const handleBuy = async () => {
    try {
      await axios.post(url + "shop/", obj);
      setPurchased(true);
      toast.success("You Successfully Purchased the Item!");
      navigate("/settings");
    } catch (error) {
      toast.error("You Can't buy the Item");
    }
  };

  useEffect(() => {
    if (Array.isArray(owned) && FilterItems(owned, name)) {
      setPurchased(true);
    }
  }, [owned, name]);

  if (price == 0) return;
  return (
    <div className="Card-container">
      <div onClick={() => handleBuy()} className="Item-img">
        <div className="Item-img-animation">
          <p>{purchased ? "Owned" : "BUY IT!"}</p>
        </div>
        <img src={image} alt="item" />
        <div className="Item-img-animation2"></div>
      </div>
      <div className="ItemValueContainer">
        <h1 className="Item-title">{name}</h1>
        {purchased ? (
          <div className="Item-price">{"Owned"}</div>
        ) : (
          <div className="Item-price">{price + "$"}</div>
        )}
      </div>
    </div>
  );
}
