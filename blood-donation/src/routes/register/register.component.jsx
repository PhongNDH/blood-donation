import "./register.style.scss";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useState, useContext } from "react";

import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { IndexContext } from "../../contexts/index.context";
import { UserContext } from "../../contexts/user.context";

import Logo from "../../components/logo/logo.component";
//import Toast from "../../components/toast/toast.component";

import { BloodType } from "../../sources/labels";

const Register = () => {
  const { setIndex } = useContext(IndexContext);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("2000-05-24");
  const [bloodGroup, setBloodGroup] = useState("");

  const OnUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const OnEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const OnPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const OnConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const OnPhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const OnGenderChange = (e) => {
    setGender(e.target.value);
  };
  const OnBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };
  const OnBloodGroupChange = (e) => {
    setBloodGroup(e.target.value);
  };

  const OnSubmitRegister = (e) => {
    e.preventDefault();
    if(username === ""){
      alert("Please fill your username");return;
    }
    else if (email === "") {
      alert("Please fill your email");return;
    }
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      alert("Please check your email");return;
    }
    else if (password !== confirmPassword) {
      alert("Passwords confirmation and passwords need to match");return;
    }
    else if(phoneNumber.length !== 10){
      alert("Phone number must has 10 digits");return;
    }
    else if(gender === ""){
      alert("Please fill your gender");return;
    }
    else if(bloodGroup === ""){
      alert("Please fill your blood-type");return;
    }
    else if(Date.parse(birthdate) >= Date.parse(new Date())){
      alert("Please check your birthdate");return;
    }

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dob: birthdate,
        email: email,
        name: username,
        gender: gender,
        phone_number: phoneNumber,
        password: password,
        blood_group: bloodGroup,
      }),
    })
      .then((res) => res.json())
      .then((user) => {
        if(user === 'Unable to register'){
          alert("Unable to register");
          return;
        }
        if (typeof user === "object") {
          setCurrentUser(user);
          navigate("/home");
          window.scrollTo(0,0);
        }
      });
  };

  return (
    <Fragment>
      <div className="sign-up-container">
        {/* <h2>Don't have an account?</h2> */}
        <Link onClick={() => setIndex(0)} to="/">
          <Logo></Logo>
        </Link>
        <h2 className="sign-up-header">Sign up with your email and password</h2>
        <form className="sign-up-form">
          <div className="sign-up-textfield">
            <TextField
              className="sign-up-input"
              id="standard-basic"
              label="Username"
              variant="standard"
              onChange={OnUsernameChange}
            />
            <TextField
              className="sign-up-input"
              id="standard-basic"
              label="Email"
              variant="standard"
              type="email"
              onChange={OnEmailChange}
            />
            <TextField
              className="sign-up-input"
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              onChange={OnPasswordChange}
            />
            <TextField
              className="sign-up-input"
              id="standard-basic"
              label="Confirm Password"
              variant="standard"
              type="password"
              onChange={OnConfirmPasswordChange}
            />

            <TextField
              className="sign-up-input"
              id="standard-basic"
              label="Phone number"
              variant="standard"
              onChange={OnPhoneNumberChange}
            />

            <FormControl className="sign-up-input sign-up-gender">
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={OnGenderChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              className="sign-up-input sign-up-datebirth"
              id="date"
              label="Choose your birthdate"
              type="date"
              defaultValue="2000-05-24"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={OnBirthdateChange}
            />

            <FormControl className="sign-up-input sign-up-blood-type">
              <FormLabel id="demo-row-radio-buttons-group-label">
                Blood-type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={OnBloodGroupChange}
              >
                {BloodType.map((blood, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={blood.value}
                      control={<Radio />}
                      label={blood.label}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </div>
          <button
            onClick={OnSubmitRegister}
            type="button"
            className="buttons-container btn btn-success"
          >
            Register
          </button>
          <div className="register-signin">
            <span>Already have an account?&nbsp;</span>
            <Link to="/signin">Sign in</Link>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Register;
