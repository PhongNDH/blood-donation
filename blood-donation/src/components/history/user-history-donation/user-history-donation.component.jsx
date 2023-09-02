import "./user-history-donation.style.scss";

import LocationImg from "../../../assets/home/maps-and-flags.png";

import TimeImg from "../../../assets/home/calendar.png";
import CloseImg from "../../../assets/home/close.png";

import BloodGroup from "../../blood-group/blood-group.component";
import Select from "react-select";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";
import { Diseases } from "../../../sources/labels";
import { UserContext } from "../../../contexts/user.context";

const orders = [{ value: "Donate_date desc", label: "Date" }];

const unit = [
  { value: 250, label: "250 ml" },
  { value: 350, label: "350 ml" },
  { value: 450, label: "450 ml" },
];

const diseaseYesNo = [
  { value: "None", label: "None" },
  { value: "Have", label: "Have" },
];

const filters = [
  { value: "all", label: "All" },
  { value: "Status:pending", label: "Status : Pending" },
  { value: "Status:rejected", label: "Status : Rejected" },
  { value: "Status:approved", label: "Status : Approved" },
  { value: "Disease:None", label: "Disease : None" },
];

const UserHistoryDonation = () => {
  const { currentUser } = useContext(UserContext);

  const [bloodGroup, setBloodGroup] = useState("");
  const [uid, setUid] = useState("");
  const [location, setLocation] = useState([]);
  const [locationSelection, setLocationSelection] = useState([]);
  const [arrangement, setArrangement] = useState("Donate_date desc");
  const [filterInfo, setFilterInfo] = useState({ field: "", content: "" });

  const [histories, setHistories] = useState([]);

  const [hasDisease, setHasDisease] = useState("None");
  const [hasOtherDisease, setHasOtherDisease] = useState("");

  const [infoUpdate, setInfoUpdate] = useState("");
  const [unitUpdate, setUnitUpdate] = useState("");
  const [locationUpdate, setLocationUpdate] = useState("");
  const [diseaseUpdate, setDiseaseUpdate] = useState("");

  const OnOrderChange = (e) => {
    setArrangement(e.value);
  };
  const OnFilterChange = (e) => {
    if (e.value === "all") {
      setFilterInfo({ field: "", content: "" });
    } else {
      var a = e.value.split(":");
      setFilterInfo({
        field: a[0],
        content: a[1],
      });
    }
  };

  //API
  const GetLocation = () => {
    fetch("http://localhost:3000/get-location", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocation(
          data.map((location) => {
            return {
              id: location.Location_id,
              name: location.Address,
              label: location.Location_name,
            };
          })
        );

        setLocationSelection(
          data.map((location) => {
            return {
              value: location.Location_id,
              label: location.Address,
            };
          })
        );
      });
  };
  const GetUserDonationHistory = useCallback(() => {
    fetch("http://localhost:3000/user-donation-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: uid,
        order: arrangement,
        field: filterInfo.field,
        content: filterInfo.content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setHistories(
          data.map((history) => {
            return {
              donate_id: history.Donate_id,
              date: history.Donate_date,
              unit: history.Unit,
              disease: history.Disease,
              bloodGroup: bloodGroup,
              locationId: history.Lid,
              status: history.Status,
            };
          })
        );
      });
  }, [uid, bloodGroup, arrangement, filterInfo]);
  const DeleteDonation = (id) => {
    fetch(`http://localhost:3000/user-delete-donation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donate_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert("Delete successfully");
          GetUserDonationHistory();
        }
      });
  };
  const OnClickButtonUpdate = (id) => {
    fetch(`http://localhost:3000/user-update-donation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donate_id: id,
        unit: unitUpdate,
        location_id: locationUpdate,
        disease: diseaseUpdate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert("Update successfully");
          GetUserDonationHistory();
        }
      });
  };

  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    GetUserDonationHistory();
  }, [GetUserDonationHistory]);

  useEffect(() => {
    if (currentUser !== null) {
      setBloodGroup(currentUser.Blood_group);
      setUid(currentUser.User_id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (hasDisease === "None") {
      setDiseaseUpdate("None");
    } else {
      if (hasOtherDisease !== "Other") {
        setDiseaseUpdate(hasOtherDisease);
      } else {
        setDiseaseUpdate("");
      }
    }
  }, [hasDisease, hasOtherDisease]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === false ? (
        <div className="u-h-d-container">
          <h2>Donations History</h2>
          <div className="u-h-d-search-bar">
            <div className="u-h-d-search">
              <div className="u-h-d-order">
                <span className="u-h-d-span">Order by</span>
                <Select
                  id="u-h-d-bloodgroup"
                  onChange={OnOrderChange}
                  options={orders}
                  defaultValue={orders[0]}
                />
              </div>
              <div className="u-h-d-filter">
                <span className="u-h-d-span">Filter</span>
                <Select
                  id="u-h-d-bloodgroup"
                  onChange={OnFilterChange}
                  options={filters}
                  defaultValue={filters[0]}
                />
              </div>
            </div>
          </div>

          {/* History */}
          <div className=" u-h-d-history">
            {histories.map((history, index) => {
              return (
                <div className="u-h-d-detail" key={index}>
                  <div className="u-h-d-info">
                    <div className="u-h-d-date_location">
                      <div className="u-h-d-date">
                        <img src={TimeImg} alt="" width="28px" height="28px" />
                        <span>
                          {new Date(history.date).getDate()}/
                          {new Date(history.date).getMonth() + 1}/
                          {new Date(history.date).getFullYear()}
                        </span>
                      </div>
                      <div className="u-h-d-location">
                        <img
                          src={LocationImg}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                        <span>
                          {
                            location.find((location) => {
                              return location.id === history.locationId;
                            }).name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="u-h-d-unit_disease_blood-type">
                      <div className="u-h-d-unit_disease">
                        <pre className="u-h-d-unit">
                          Unit &nbsp;&nbsp; : {history.unit} ml{" "}
                          <div className="u-h-d-blood-type">
                            <BloodGroup
                              bloodType={history.bloodGroup}
                              size="24px"
                            />
                          </div>
                        </pre>
                        <pre>
                          Disease :{" "}
                          <span
                            className={
                              history.disease !== "None"
                                ? "u-h-d-disease"
                                : "u-h-d-disease-none"
                            }
                          >
                            {history.disease}
                          </span>
                        </pre>
                      </div>
                    </div>
                  </div>
                  {history.status === "pending" ? (
                    <div className="u-h-d-action">
                      <span>Action</span>
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginTop: "4px",
                        }}
                        onClick={() => {
                          setInfoUpdate({
                            id: history.donate_id,
                            unit: history.unit,
                            locationId: history.locationId,
                            disease: history.disease,
                          });
                          setUnitUpdate(history.unit);
                          setLocationUpdate(history.locationId);
                          setDiseaseUpdate("None");
                          window.scroll(0, 500);
                        }}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginTop: "4px",
                        }}
                        onClick={() => {
                          DeleteDonation(history.donate_id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  {history.status === "pending" ? (
                    <div className="u-h-d-status-pending">
                      <span className="u-h-d-status-text">Pending</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {history.status === "approved" ? (
                    <div className="u-h-d-status-approved">
                      <span className="u-h-d-status-text">Approved</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {history.status === "rejected" ? (
                    <div className="u-h-d-status-rejected">
                      <span className="u-h-d-status-text">Rejected</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>

          {/*Form */}
          {infoUpdate !== "" ? (
            <div className="u-h-d-update">
              <h4>Donation Update</h4>
              <form
                method="post"
                action=""
                className="u-h-d-form"
                onSubmit={(e) => e.defaultPrevented()}
              >
                <div className="u-h-d-group">
                  <label className="u-h-d-label" htmlFor="u-h-d-unit">
                    Unit (in ml)
                  </label>
                  <Select
                    id="u-h-d-unit"
                    options={unit}
                    onChange={(e) => {
                      setUnitUpdate(e.value);
                    }}
                    defaultValue={
                      unit[
                        unit.findIndex((a) => {
                          return a.value === infoUpdate.unit;
                        })
                      ]
                    }
                  />
                </div>

                <div className="u-h-d-group">
                  <label className="u-h-d-label" htmlFor="u-h-d-location">
                    Location
                  </label>
                  <Select
                    id="u-h-d-location"
                    options={locationSelection}
                    defaultValue={locationSelection[infoUpdate.locationId - 1]}
                    onChange={(e) => {
                      setLocationUpdate(e.value);
                    }}
                  />
                </div>

                <div className="u-h-d-group ">
                  <label className="u-h-d-label" htmlFor="u-h-d-disease-yesno">
                    Disease
                  </label>
                  <Select
                    id="u-h-d-disease-yesno"
                    options={diseaseYesNo}
                    onChange={(e) => setHasDisease(e.value)}
                    defaultValue={diseaseYesNo[0]}
                  />
                </div>
                {hasDisease === "Have" ? (
                  <div className="u-h-d-group u-h-d-disease-name ">
                    <label
                      className="u-h-d-label"
                      htmlFor="u-h-d-disease"
                    ></label>
                    <Select
                      id="u-h-d-disease"
                      options={Diseases}
                      onChange={(e) => setHasOtherDisease(e.value)}
                      maxMenuHeight="160px"
                    />
                  </div>
                ) : (
                  ""
                )}
                {hasOtherDisease === "Other" && hasDisease === "Have" ? (
                  <div className="u-h-d-group">
                    <label
                      className="u-h-d-label"
                      htmlFor="u-h-d-disease-other"
                    ></label>
                    <input
                      type="text"
                      id="u-h-d-disease-other"
                      name="unit"
                      onChange={(e) => {
                        setDiseaseUpdate(e.target.value);
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}

                <button
                  style={{
                    width: "50%",
                    margin: "8px auto 0",
                    fontWeight: "600",
                  }}
                  type="button"
                  className="btn btn-outline-info"
                  onClick={() => {
                    OnClickButtonUpdate(infoUpdate.id);
                  }}
                >
                  Update
                </button>
                <img
                  className="u-h-d-form-close"
                  src={CloseImg}
                  width="32px"
                  height="32px"
                  alt=""
                  onClick={() => {
                    setInfoUpdate("");
                    window.scrollTo(0, 0);
                  }}
                />
              </form>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default UserHistoryDonation;
