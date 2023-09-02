import "./authentication.style.scss";

import { useNavigate } from "react-router-dom";

const AuthenticationFrame = ({ content, note, buttonText, logo, link }) => {
  const navigate = useNavigate();

  const OnClickButton = () => {
    navigate(link);
  };
  return (
    <div className="authentication-frame-container">
      <h3>{content}</h3>
      <span>{note}</span>
      <button type="button" className="btn btn-success" onClick={OnClickButton}>
        {buttonText}
      </button>

      <img src={logo} alt="" />
    </div>
  );
};

export default AuthenticationFrame;
