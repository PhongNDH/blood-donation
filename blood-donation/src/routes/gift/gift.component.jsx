import "./gift.style.scss";

import { Fragment, useContext, useState, useEffect } from "react";

import TeddyImg from "../../assets/item/teddy.png";
import BagImg from "../../assets/item/bag.jpg";
import BowlImg from "../../assets/item/bowl-set.jpg";
import CactusImg from "../../assets/item/cactus.png";
import GlassImg from "../../assets/item/glasses.png";
import HelmetImg from "../../assets/item/helmet.png";
import LaptopBagImg from "../../assets/item/laptop-bag.jpeg";
import ShampooImg from "../../assets/item/shampoo.png";
import SucculentImg from "../../assets/item/succulent.png";
import SuperTepidImg from "../../assets/item/super-tepid.png";
import TeddyOctopusImg from "../../assets/item/teddy-octopus.jpg";
import TeaSetImg from "../../assets/item/tea-set.png";

import { UserContext } from "../../contexts/user.context";

const imgArray = [
  TeddyImg,
  BagImg,
  BowlImg,
  CactusImg,
  GlassImg,
  HelmetImg,
  LaptopBagImg,
  ShampooImg,
  SucculentImg,
  SuperTepidImg,
  TeddyOctopusImg,
  TeaSetImg,
];

const Gift = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [gifts, setGifts] = useState([]);
  const [uid, setUid] = useState("");
  //const [point, setPoint] = useState("");

  const GetGift = () => {
    fetch("http://localhost:3000/get-gift", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setGifts(
          data.map((gift) => {
            return {
              id: gift.Gift_id,
              name: gift.Gname,
              point: gift.Point,
              remain: gift.Remain,
            };
          })
        );
      });
  };

  const ReceivedGift = (id, point, remain) => {
    if (currentUser.Point < point) {
      alert("You do not have enough point");
      return;
    }
    if (remain < 1) {
      alert("This gifts is out of stock");
      return;
    }
    fetch(`http://localhost:3000/user-receive-gift`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gift_id: id,
        user_id: uid,
        point: point,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "object") {
          alert("Recieve successfully");
          GetGift();
          setCurrentUser(data);
        }
      });
  };

  useEffect(() => {
    GetGift();
  }, []);

  useEffect(() => {
    if (currentUser != null) setUid(currentUser.User_id);
  }, [currentUser]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === false ? (
        <div className="gift-container">
          <h2>Please choose your gifts</h2>
          <span>Your point : {currentUser.Point}</span>
          <div className="gift-items">
            {gifts.map((gift, index) => {
              return (
                <div className="gift-detail" key={index}>
                  <img src={imgArray[index]} alt="" width="100%" />
                  <div className="gift-name">{gift.name}</div>
                  <div className="gift-info">
                    <div className="gift-point">{gift.point} Point Needed</div>
                    <div className="gift-remain"> Remain {gift.remain} </div>
                  </div>
                  <div className="gift-button">
                    <button
                      type="button"
                      className=" btn btn-outline-light"
                      onClick={() => {
                        ReceivedGift(gift.id, gift.point, gift.remain);
                      }}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Gift;
