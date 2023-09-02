import "./auto-movement-img.style.scss";
import { useEffect, useState, useRef } from "react";

import DonationImg1 from "../../../assets/auto-movement-img/Blood-Donation-1.png";
import DonationImg2 from "../../../assets/auto-movement-img/Blood-facts.png";
import DonationImg3 from "../../../assets/auto-movement-img/blood-donor-day.png";

const colors = ["#0088FE", "#00C49F", "#FFBB28"];
const donationImages = [DonationImg1, DonationImg2, DonationImg3];
const delay = 10000;
const AutoMovementImage = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {donationImages.map((image, index) => (
          <img className="slideshow-img" key={index} src = {image} alt="donation"/>
        ))}
      </div>

      <div className="slideshowDots">
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AutoMovementImage;
