import "./request.style.scss";
import { useState } from "react";

import Calender from "react-calendar";
// import 'react-calendar/dist/Calendar.css'
import "./Calendar.scss";

const Request = () => {
  const [date, setDate] = useState(new Date().toString());

  const onCalenderChange = (event) => {
    console.log(date);
    setDate(new Date(event).toString());
    // if(new Date(event).toString() === new Date('1/12/2023').toString()){
    //   console.log(1);
    // }
  };

  return (
    <div>
      <Calender
        onChange={onCalenderChange}
        locale="en-GB"
        minDate={new Date()}
      />
    </div>
  );
};

export default Request;
