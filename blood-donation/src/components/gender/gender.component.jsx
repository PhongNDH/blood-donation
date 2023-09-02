import "./gender.style.scss";
import MaleIcon from  "../../assets/group-type/male-gender.png";
import FemaleIcon from  "../../assets/group-type/female.png";

const Gender = ({gender,size}) => {
  return(
    <div>
      <img src={gender === "male" ? MaleIcon : FemaleIcon} alt="" width={size} height={size} />
    </div>
  )
}

export default Gender;