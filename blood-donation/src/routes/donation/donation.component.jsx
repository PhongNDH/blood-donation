import "./donation.component.scss";
import Select from "react-select";

import { useState, Fragment, useEffect, useContext } from "react";
import { Diseases, Unit } from "../../sources/labels";
//import Toast from "../../components/toast/toast.component";

import { UserContext } from "../../contexts/user.context";

const diseaseYesNo = [
  { value: "None", label: "None" },
  { value: "Have", label: "Have" },
];

const Donation = () => {
  const { currentUser } = useContext(UserContext);

  const [hasDisease, setHasDisease] = useState("None");
  const [hasOtherDisease, setHasOtherDisease] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState([]);

  const [donationLocation, setDonationLocation] = useState("");
  const [unit, setUnit] = useState("");
  const [disease, setDisease] = useState("None");
  const [uid, setUid] = useState("");

  //const [error, setError] = useState("");

  const OnUnitChange = (e) => {
    setUnit(e.value);
  };
  const OnDonationLocationChange = (e) => {
    setDonationLocation(e.value);
  };
  const OnDiseaseYesNoChange = (e) => {
    setHasDisease(e.value);
  };
  const OnHasOtherDiseaseChange = (e) => {
    setHasOtherDisease(e.value);
  };
  const DiseaseTextChange = (e) => {
    setDisease(e.target.value);
  };

  const GetLocation = () => {
    fetch("http://localhost:3000/get-location", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations(
          data.map((location) => {
            return {
              value: location.Location_name,
              label: location.Address,
            };
          })
        );
        setLocationId(
          data.map((location) => {
            return {
              id: location.Location_id,
              value: location.Location_name,
            };
          })
        );
      });
  };

  const OnSubmitDonation = (e) => {
    e.preventDefault();
    if (unit === "") {
      alert("Please complete a unit field");
      return;
    } else if (donationLocation === "") {
      alert("Please complete a location field");
      return;
    } else if (disease === "") {
      alert("Please select a disease field");
      return;
    }

    fetch("http://localhost:3000/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: uid,
        lid: locationId.find((location) => {
          return location.value === donationLocation;
        }).id,
        unit: unit,
        disease: disease,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert('Success')
        }
      });
  };

  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    if (currentUser !== null) {
      setUid(currentUser.User_id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (hasDisease === "None") {
      setDisease("None");
    } else {
      if (hasOtherDisease !== "Other") {
        setDisease(hasOtherDisease);
      } else {
        setDisease("");
      }
    }
  }, [hasDisease, hasOtherDisease]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === false ? (
        <div className="donate-container">
          <h3>Donate blood</h3>
          <form method="post" action="" className="donate-form">
            <div className="donate-group">
              <label className="donate-label" htmlFor="donate-unit">
                Unit (in ml)
              </label>
              <Select id="donate-unit" options={Unit} onChange={OnUnitChange} />
            </div>

            <div className="donate-group">
              <label className="donate-label" htmlFor="donate-location">
                Location
              </label>
              <Select
                id="donate-location"
                options={locations}
                onChange={OnDonationLocationChange}
              />
            </div>

            <div className="donate-group ">
              <label className="donate-label" htmlFor="donate-disease-yesno">
                Disease
              </label>
              <Select
                id="donate-disease-yesno"
                options={diseaseYesNo}
                onChange={OnDiseaseYesNoChange}
                defaultValue={diseaseYesNo[0]}
              />
            </div>
            {hasDisease === "Have" ? (
              <div className="donate-group donate-disease-name ">
                <label
                  className="donate-label"
                  htmlFor="donate-disease"
                ></label>
                <Select
                  id="donate-disease"
                  options={Diseases}
                  onChange={OnHasOtherDiseaseChange}
                  maxMenuHeight="160px"
                />
              </div>
            ) : (
              ""
            )}
            {hasOtherDisease === "Other" && hasDisease === "Have" ? (
              <div className="donate-group">
                <label
                  className="donate-label"
                  htmlFor="donate-disease-other"
                ></label>
                <input
                  type="text"
                  id="donate-disease-other"
                  name="unit"
                  onChange={DiseaseTextChange}
                />
              </div>
            ) : (
              ""
            )}

            <button
              style={{ width: "50%", margin: "8px auto 0" }}
              type="button"
              className="btn btn-primary"
              onClick={OnSubmitDonation}
            >
              Donate
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Donation;
