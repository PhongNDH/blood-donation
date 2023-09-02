import "./exploration.style.scss";

import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

import WebFont from "webfontloader";

const Exploration = ({ title, content }) => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Rubik Bubbles", "Vollkorn"],
      },
    });
  }, []);

  return (
    <div className="exploration-container">
      <h3>{title}</h3>
      <span>{content}</span>
    </div>
  );
};

export default Exploration;
