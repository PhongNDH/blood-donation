import "./home.style.scss";
import { useState, useContext, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import { IndexContext } from "../../contexts/index.context";
import { UserContext } from "../../contexts/user.context";

// import ListImg from "../../assets/img/list.png";
import Footer from "../../components/home/footer/footer.component";

import HomeImg from "../../assets/home/home.png";
import GiftImg from "../../assets/home/toxic-warning-sign.png";
import RequestImg from "../../assets/home/blood.png";
import StatisticsImg from "../../assets/home/sugar-blood-level.png";
import UserDetailsImg from "../../assets/home/donor.png";
import DonationImg from "../../assets/home/blood-drop.png";
import HistoryImg from "../../assets/home/history.png";

// const component = [
//     {
//       link: "/home",
//       image: HomeImg,
//       content: "Home",
//     },
//     {
//       link: "/home/statistics",
//       image: StatisticsImg,
//       content: "Statistics",
//     },
//     {
//       link: "/home/user-details",
//       image: UserDetailsImg,
//       content: "Users",
//     },
//     {
//       link: "/home/admin-donation",
//       image: DonationImg,
//       content: "Donations",
//     },
//     {
//       link: "/home/admin-request",
//       image: RequestImg,
//       content: "Requests",
//     },
//     {
//       link: "/home/admin-history",
//       image: HistoryImg,
//       content: "History(s)",
//     },
//     {
//       link: "/home/user-donate",
//       image: DonationImg,
//       content: "Donate",
//     },
//     {
//       link: "/home/user-request",
//       image: RequestImg,
//       content: "Request",
//     },
//     {
//       link: "/home/user-history",
//       image: HistoryImg,
//       content: "History",
//     },
//     {
//       link: "/home/gift",
//       image: GiftImg,
//       content: "Gift",
//     },
// ]

const element = [
  {
    link: "/home",
    image: HomeImg,
    content: "Home",
  },
];

const adminElement = [
  {
    link: "/home",
    image: HomeImg,
    content: "Home",
  },
  {
    link: "/home/statistics",
    image: StatisticsImg,
    content: "Statistics",
  },
  {
    link: "/home/user-details",
    image: UserDetailsImg,
    content: "Users",
  },
  {
    link: "/home/admin-donation",
    image: DonationImg,
    content: "Donations",
  },
  {
    link: "/home/admin-request",
    image: RequestImg,
    content: "Requests",
  },
  {
    link: "/home/admin-history",
    image: HistoryImg,
    content: "History",
  },
];

const userElement = [
  {
    link: "/home",
    image: HomeImg,
    content: "Home",
  },
  {
    link: "/home/user-donate",
    image: DonationImg,
    content: "Donate",
  },
  {
    link: "/home/user-request",
    image: RequestImg,
    content: "Request",
  },
  {
    link: "/home/user-history",
    image: HistoryImg,
    content: "History",
  },
  {
    link: "/home/gift",
    image: GiftImg,
    content: "Gift",
  },
];

const elderUserElement = [
  {
    link: "/home",
    image: HomeImg,
    content: "Home",
  },
  // {
  //   link: "/home/user-donate",
  //   image: DonationImg,
  //   content: "Donate",
  // },
  {
    link: "/home/user-request",
    image: RequestImg,
    content: "Request",
  },
  {
    link: "/home/user-history",
    image: HistoryImg,
    content: "History",
  },
  {
    link: "/home/gift",
    image: GiftImg,
    content: "Gift",
  },
];

const Home = () => {
  const { index, setIndex } = useContext(IndexContext);
  const { currentUser } = useContext(UserContext);

  const [currentElement, setCurrentElement] = useState(element);

  useEffect(() => {
    if (currentUser !== null) {
      if (currentUser.IsAdmin === true) {
        setCurrentElement(adminElement);
      } else {
        var age = Math.floor(
          (new Date() - new Date(currentUser.Dob)) / (365 * 24 * 60 * 60 * 1000)
        );
        if (age < 18 || age > 60) setCurrentElement(elderUserElement);
        else setCurrentElement(userElement);
      }
    } else {
      setCurrentElement(element);
    }
  }, [currentUser]);

  return (
    <div className="home-container">
      <div className="home-vertical-menu">
        <div className="home-menu-content">
          <ul className="aside__list">
            {currentElement.map((element, idx) => {
              return (
                <li
                  key={idx}
                  className={`aside__item ${
                    idx === index ? "aside--active" : ""
                  } `}
                >
                  <Link
                    onClick={() => {
                      setIndex(idx);
                      window.scrollTo(0, 0);
                    }}
                    to={element.link}
                  >
                    <img
                      className="aside__item--img"
                      src={element.image}
                      alt=""
                    />
                    <span className="aside__item--span">{element.content}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="home-outlet">
        <Outlet />
      </div>
      <div className="home-footer">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Home;
