import "./request.style.scss";

import Select from "react-select";
import { useState, Fragment, useContext, useEffect } from "react";
import { Reasons } from "../../sources/labels";

import { UserContext } from "../../contexts/user.context";

const Request = () => {
  const { currentUser } = useContext(UserContext);

  const [hasOtherReason, setHasOtherReason] = useState("");

  const [unit, setUnit] = useState("");
  const [reason, setReason] = useState("");
  const [uid, setUid] = useState("");
  //const [bloodGroup, setBloodGroup] = useState("");

  const OnUnitChange = (e) => {
    setUnit(e.target.value);
  };
  const OnHasOtherReasonChange = (e) => {
    setHasOtherReason(e.value);
  };
  const OnReasonTextChange = (e) => {
    setReason(e.target.value);
  };
  const OnSubmitRequest = (e) => {
    e.preventDefault();
    if (unit === "") {
      alert("Please complete a unit field");
      return;
    } else if (reason === "") {
      alert("Please complete a reason field");
      return;
    }
    fetch("http://localhost:3000/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: uid,
        unit: unit,
        reason: reason,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert("Success");
        }
      });
  };

  useEffect(() => {
    if (currentUser !== null) {
      setUid(currentUser.User_id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (hasOtherReason !== "Other") {
      setReason(hasOtherReason);
    } else {
      setReason("");
    }
  }, [hasOtherReason]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === false ? (
        <div className="request-container">
          <h3>Make Blood Request </h3>
          <form method="post" action="" className="request-form">
            {/* <div className="request-group request-blood-type">
              <label className="request-label" htmlFor="request-bloodgroup">
                Blood-type request
              </label>
              <Select
                id="request-bloodgroup"
                onChange={OnBloodGroupChange}
                options={BloodType}
              />
            </div> */}

            <div className="request-group">
              <label className="request-label" htmlFor="request-unit">
                Unit (in ml)
              </label>
              <input
                type="text"
                id="request-unit"
                name="unit"
                onChange={OnUnitChange}
              />
            </div>

            {/* <div className="request-group">
            <label className="request-label" htmlFor="request-location">
              Location
            </label>
            <Select id="request-location" options={locations} />
          </div> */}

            <div className="request-group request-reason ">
              <label className="request-label" htmlFor="request-reason-content">
                Reason
              </label>
              <Select
                id="request-reason-content"
                options={Reasons}
                onChange={OnHasOtherReasonChange}
                maxMenuHeight="240px"

              />
            </div>
            {hasOtherReason === "Other" ? (
              <div className="request-group">
                <label
                  className="request-label"
                  htmlFor="request-reason-other"
                ></label>
                <input
                  type="text"
                  id="request-reason-other"
                  name="unit"
                  onChange={OnReasonTextChange}
                />
              </div>
            ) : (
              ""
            )}

            <button
              style={{ width: "50%", margin: "8px auto 0" }}
              type="button"
              className="btn btn-primary"
              onClick={OnSubmitRequest}
            >
              Request
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Request;
