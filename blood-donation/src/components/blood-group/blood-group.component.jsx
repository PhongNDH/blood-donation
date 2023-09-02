import "./blood-group.style.scss";

import APlusImg from "../../assets/group-type/blood-type-A+.png";
import AMinusImg from "../../assets/group-type/blood-type-A-.png";
import BPlusImg from "../../assets/group-type/blood-type-B+.png";
import BMinusImg from "../../assets/group-type/blood-type-B-.png";
import OPlusImg from "../../assets/group-type/blood-type-O+.png";
import OMinusImg from "../../assets/group-type/blood-type-O-.png";
import ABPlusImg from "../../assets/group-type/blood-type-AB+.png";
import ABMinusImg from "../../assets/group-type/blood-type-AB-.png";


import { Fragment } from "react";
const BloodGroup = ({ bloodType,size }) => {
  return (
    <Fragment>
      {bloodType === "A+" ? <img src={APlusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "A-" ? <img src={AMinusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "B+" ? <img src={BPlusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "B-" ? <img src={BMinusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "O+" ? <img src={OPlusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "O-" ? <img src={OMinusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "AB+" ? <img src={ABPlusImg} alt="" width={size} height={size} /> : ""}
      {bloodType === "AB-" ? <img src={ABMinusImg} alt="" width={size} height={size} /> : ""}
    </Fragment>
  );
};

export default BloodGroup;
