import "./logo.style.scss";
import Tilt from "react-tilt";
import logo from "../../assets/img/NicePng_donate-icon-png_1179838.png";

const Logo = () => {
  return (
    <div className="logo-container ">
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 25 }}
        style={{ height: 80, width: 80 }}
      >
        <div className="Tilt-inner pa1">
          <img src={logo} alt="Brain" width="60%" height="60%"/>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
