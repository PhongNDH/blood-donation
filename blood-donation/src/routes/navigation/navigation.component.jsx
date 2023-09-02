import "./navigation.style.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Fragment, useContext } from "react";

//import Logo from "../../components/logo/logo.component";
//import GithubLogo from "../../assets/img/github.png";
import BloodDononationLogo from "../../assets/img/BloodLogo.jpg";
import Profile from "../../assets/home/profile-user.png";
// import Toast from "../../components/toast/toast.component";

import { IndexContext } from "../../contexts/index.context";
import { UserContext } from "../../contexts/user.context";

import ParticlesSystem from "../../components/particles/particles.component.jsx";

const Navigation = () => {
  const navigate = useNavigate();
  const { setIndex } = useContext(IndexContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const onLogOut = () => {
    setCurrentUser(null);
    navigate("/home");
    window.scrollTo(0, 0);
  };

  return (
    <Fragment>
      <ParticlesSystem />
      <nav className="navigation-container navbar navbar-expand-lg navbar-light bg-light">
        <Link
          onClick={() => setIndex(0)}
          to="/home"
          className="navbar-brand me-2"
        >
          <img
            className="navigation-logo"
            src={BloodDononationLogo}
            height="60px"
            alt="MDB Logo"
            loading="lazy"
            style={{ marginTop: "-1px", borderRadius: "20px" }}
          />
        </Link>

        <div className="collapse navbar-collapse" id="navbarButtonsExample">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link className="nav-link">Dashboard</Link>
            </li> */}
          </ul>

          <div className="d-flex align-items-center">
            {currentUser == null ? "" : <h4 className="profile-username">{currentUser.Name}</h4>}
            {currentUser == null ? (
              ""
            ) : (
              <Link
                className="profile-logo"
                to="/profile"
                style={{ marginLeft: "12px" }}
              >
                <img
                  src={Profile}
                  alt="Profile logo"
                  width="38px"
                  height="38px"
                />
              </Link>
            )}
            {currentUser == null ? (
              <Fragment>
                <Link to="/signin">
                  <button
                    type="button"
                    className="button-signin btn btn-primary me-3"
                  >
                    Sign in
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    type="button"
                    className="button-signin btn btn-primary me-3"
                  >
                    Register
                  </button>
                </Link>
              </Fragment>
            ) : (
              <button
                type="button"
                className="button-signin btn btn-primary me-3"
                onClick={onLogOut}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* <div className="navigation-container">
        <header className="bg-black-90 fixed w-100 ph3 pv3 pv4-ns ph4-m ph5-l">
          <nav className="flex justify-between bb b--white-10">
            <Link className="white-70 hover-white no-underline flex items-center pa3" to="/">
              <Logo></Logo>
            </Link>
            <div className="flex-grow pa3 flex items-center">
              <Link className="f6 link dib white dim mr3 mr4-ns">About</Link>
              <Link className="f6 link dib white dim mr3 mr4-ns" to="/signin">Sign In</Link>
              <Link className="f6 dib white bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20">
                Sign Up
              </Link>
            </div>
          </nav>
        </header>
      </div> */}
      <Outlet></Outlet>
    </Fragment>
  );
};

export default Navigation;
