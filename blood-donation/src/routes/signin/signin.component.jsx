import "./signin.style.scss";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useState, useContext } from "react";

import { IndexContext } from "../../contexts/index.context";
import { UserContext } from "../../contexts/user.context";

import TextField from "@mui/material/TextField";

import Logo from "../../components/logo/logo.component";

const Signin = () => {
  const navigate = useNavigate();
  const { setIndex } = useContext(IndexContext);
  const { setCurrentUser } = useContext(UserContext);

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const OnEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const OnPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const OnSubmitSignin = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then((res) => res.json())
    .then((user) => {
      if(user === 'Unable to signin'){
        alert("Email or password are not match");
      }
      if (typeof user === "object") {
        setCurrentUser(user);
        setIndex(0);
        navigate("/");
      }
    })
  };

  return (
    <Fragment>
      <div className="signin-container">
        {/* <h2>Don't have an account?</h2> */}
        <Link onClick={() => setIndex(0)} to="/">
          <Logo></Logo>
        </Link>
        <span className="signin-header">
          Sign in with your email and password
        </span>
        <form className="signin-form">
          <div className="signin-textfield">
            <TextField
              className="signin-input"
              id="standard-basic"
              label="Email"
              variant="standard"
              type="email"
              onChange={OnEmailChange}
            />

            <TextField
              className="signin-input"
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              onChange={OnPasswordChange}
            />
          </div>

          <button
            onClick={OnSubmitSignin}
            type="button"
            className="buttons-container btn btn-success"
          >
            Sign in
          </button>
          <div className="register-signin">
            <span>Don't have an account?&nbsp;</span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Signin;
