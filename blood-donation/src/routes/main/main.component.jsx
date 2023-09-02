import "./main.style.scss";

import RegisterImg from "../../assets/home/register.png";
import SigninImg from "../../assets/home/signin.png";
import WinterDonationImg from "../../assets/article/winter-donation.png";
import PlasmaDonationImg from "../../assets/article/plasma-donation.png";
import DonateFirsttimeImg from "../../assets/article/firsttime-donate.png";
import BlackDonorImg from "../../assets/article/black-donor.png";
import CoronavirusUpdateImg from "../../assets/article/Coronavirus-image.png";

import AutoMovementImage from "../../components/home/auto-movement-image/auto-movement-img.component";
import AuthenticationFrame from "../../components/home/authentication-frame/authentication-frame.component";
import Article from "../../components/home/article/article.component";
import Hightlight from "../../components/home/hightlight/hightlight.component";
import Exploration from "../../components/home/exploration/exploration.component";
import Criterion from "../../components/home/donation-criterion/criterion.component";

const Main = () => {
  return (
    <div className="main-container">
      <AutoMovementImage />
      <div className="main-second">
        <div className="main-second--authen">
          <AuthenticationFrame
            content="Become a blood donor"
            note="If you are completely new to blood donation"
            buttonText="Register"
            logo={RegisterImg}
            link="/register"
          />
          <AuthenticationFrame
            content="Already a blood donor?"
            note="Sign in to manage appointments"
            buttonText="Sign in"
            logo={SigninImg}
            link="/signin"
          />
        </div>

        <div className="main-second--article">
          <Article
            imageIllustration={WinterDonationImg}
            title="Help save lives this winter"
            content="We need your help to keep providing life-saving blood to the NHS this winter."
          />
          <Article
            imageIllustration={PlasmaDonationImg}
            title="Donate plasma"
            content="Plasma is needed to create unique life-saving medicines"
          />
        </div>
      </div>
      <div className="main-third">
        <Criterion/>
      </div>
      <div className="main-forth">
        <h2>Donation hightlights</h2>
        <div className="main-forth--hightlight">
          <Hightlight
            imageIllustration={DonateFirsttimeImg}
            title="Want to donate for first time?"
            content="We always need new donors. Let us take you through the steps to becoming a donor and the process of getting that first appointment booked."
          />
          <Hightlight
            imageIllustration={BlackDonorImg}
            title="We need black donors"
            content="Sickle cell is more common in people of Black heritage. Black donors are also ten times more likely to have an important blood type used to treat the condition. Find out how you can help save the lives of people with sickle cell."
          />
          <Hightlight
            imageIllustration={CoronavirusUpdateImg}
            title="Coronavirus update"
            content="National restrictions may have lifted, but we still have extra safety measures in place at our centres. Read the latest advice before coming to donate. "
          />
        </div>
      </div>
      <div className="main-fifth">
        <h2>Explore being a donor</h2>
        <div className="main-fifth--exploration">
          <Exploration
            title="Who can give blood?"
            content="Most people can give blood if they are fit and healthy, but there are some rules for donors."
          />
          <Exploration
            title="Get the NHS Give Blood app"
            content="Once you've got an account, download our app to book and manage your appointments."
          />
          <Exploration
            title="Contact us"
            content="If you've got a question, get in touch. You can do this here online or by calling 0300 123 23 23."
          />
        </div>
      </div>
    </div>
  );
};

export default Main;

