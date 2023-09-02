import "./criterion.style.scss";

import WeighingScaleImg from "../../../assets/criterion/weighing-scale.png";
import Up18Img from "../../../assets/criterion/-18.png";
import IdImg from "../../../assets/criterion/id-card.png";
import CalenderImg from "../../../assets/criterion/calendar.png";
import HeartDiseaseImg from "../../../assets/criterion/heart-disease.png";
import TestImg from "../../../assets/criterion/test.png";
import HemoglobinImg from "../../../assets/criterion/red-blood-cells.png";
import VirusImg from "../../../assets/criterion/coronavirus.png";
import InjectionImg from "../../../assets/criterion/injection.png";
import CriterionImg from "../../../assets/img/blood-donation-criterion.jpg";

const Criterion = () => {
  return (
    <div className="criterion-container">
      <div className="criterion-1">
        <img src={CriterionImg} alt="" />
        <span>Criteria to participate in blood donation</span>
      </div>
      <div className="criterion-2">
        <img src={IdImg} alt="" />
        <span>Bring your identity card or passport</span>
      </div>
      <div className="criterion-3">
        <img src={VirusImg} alt="" />
        <span>
          No or no risk behaviors for HIV infection, hepatitis B, hepatitis C,
          and blood-borne viruses
        </span>
      </div>
      <div className="criterion-4">
        <img src={InjectionImg} alt="" />
        <span>No addiction to drugs, alcohol and stimulants</span>
      </div>
      <div className="criterion-5">
        <img src={WeighingScaleImg} alt="" />
        <span>Male &ensp;&nbsp;&nbsp; ≥&nbsp; 45 kg <br></br> Female&nbsp; ≥ &nbsp;45kg</span>
      </div>
      <div className="criterion-6">
        <img src={HeartDiseaseImg} alt="" />
        <span>
          No chronic or acute diseases of cardiovascular, blood pressure,
          respiratory, stomach ...
        </span>
      </div>
      <div className="criterion-7">
        <img src={HemoglobinImg} alt="" />
        <span>Hemoglobin(Hb) ≥120g/l (≥125g/l if donating 350ml or more).</span>
      </div>
      <div className="criterion-8">
        <img src={Up18Img} alt="" />
        <span>Able-bodied people between the ages of 18 and 60</span>
      </div>
      <div className="criterion-9">
        <img src={CalenderImg} alt="" />
        <span>
          Minimum time between 2 blood donations is 12 weeks for both Men and
          Women
        </span>
      </div>
      <div className="criterion-10">
        <img src={TestImg} alt="" />
        <span>
          Rapid test results are negative for hepatitis B virus antigen
        </span>
      </div>
    </div>
  );
};

export default Criterion;
