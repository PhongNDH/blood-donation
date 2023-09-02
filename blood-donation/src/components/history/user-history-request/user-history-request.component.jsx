import "./user-history-request.style.scss";

import Select from "react-select";
import LocationImg from "../../../assets/home/maps-and-flags.png";
import TimeImg from "../../../assets/home/calendar.png";
import CloseImg from "../../../assets/home/close.png";

import BloodGroup from "../../blood-group/blood-group.component";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";

import { Reasons } from "../../../sources/labels";
import { UserContext } from "../../../contexts/user.context";

const orders = [{ value: "Request_date desc", label: "Date" }];

const filters = [
  { value: "all", label: "All" },
  { value: "Status:pending", label: "Status : Pending" },
  { value: "Status:rejected", label: "Status : Rejected" },
  { value: "Status:approved", label: "Status : Approved" },
];

const UserHistoryRequest = () => {
  const { currentUser } = useContext(UserContext);

  //const [location, setLocation] = useState([]);
  const [uid, setUid] = useState("");
  const [arrangement, setArrangement] = useState("Request_date desc");
  const [filterInfo, setFilterInfo] = useState({ field: "", content: "" });

  const [histories, setHistories] = useState([]);

  const [hasOtherReason, setHasOtherReason] = useState("");

  const [unitUpdate, setUnitUpdate] = useState("");
  //const [bloodGroupUpdate, setBloodGroupUpdate] = useState("");
  const [reasonUpdate, setReasonUpdate] = useState("");
  const [infoUpdate, setInfoUpdate] = useState("");

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

  const GetUserRequestHistory = useCallback(() => {
    fetch("http://localhost:3000/user-request-history", {
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
              request_id: history.Request_id,
              date: history.Request_date,
              unit: history.Unit,
              reason: history.Reason,
              blood: history.Blood_group,
              status: history.Status,
            };
          })
        );
      });
  }, [uid, arrangement, filterInfo]);

  const DeleteRequest = (id) => {
    fetch(`http://localhost:3000/user-delete-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert("Delete successfully");
          GetUserRequestHistory();
        }
      });
  };
  const OnClickButtonUpdate = (id) => {
    fetch(`http://localhost:3000/user-update-request`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: id,
        unit: parseInt(unitUpdate),
        reason: reasonUpdate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          alert("Update successfully");
          GetUserRequestHistory();
        }
      });
  };

  useEffect(() => {
    GetUserRequestHistory();
  }, [GetUserRequestHistory]);

  useEffect(() => {
    if (currentUser !== null) {
      setUid(currentUser.User_id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (hasOtherReason !== "Other") {
      setReasonUpdate(hasOtherReason);
    } else {
      setReasonUpdate("");
    }
  }, [hasOtherReason]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === false ? (
        <div className="u-h-r-container">
          <h2>Requests History</h2>
          <div className="u-h-r-search-bar">
            <div className="u-h-r-search">
              <div className="u-h-r-order">
                <span className="u-h-r-span">Order by</span>
                <Select
                  id="donate-bloodgroup"
                  onChange={OnOrderChange}
                  options={orders}
                  defaultValue={orders[0]}
                />
              </div>
              <div className="u-h-r-filter">
                <span className="u-h-r-span">Filter</span>
                <Select
                  id="donate-bloodgroup"
                  onChange={OnFilterChange}
                  options={filters}
                  defaultValue={filters[0]}
                />
              </div>
            </div>
          </div>

          {/*History */}
          <div className=" u-h-r-history">
            {histories.map((history, index) => {
              return (
                <div className="u-h-r-detail" key={index}>
                  <div className="u-h-r-info">
                    <div className="u-h-r-date_location">
                      <div className="u-h-r-date">
                        <img src={TimeImg} alt="" width="28px" height="28px" />
                        <span>
                          {new Date(history.date).getDate()}/
                          {new Date(history.date).getMonth() + 1}/
                          {new Date(history.date).getFullYear()}
                        </span>
                      </div>
                      <div className="u-h-r-location">
                        <img
                          src={LocationImg}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                        <span></span>
                      </div>
                    </div>
                    <div className="u-h-r-unit_reason_blood-group">
                      <div className="u-h-r-unit_reason">
                        <pre className="u-h-r-unit">
                          Unit &nbsp; : {history.unit} ml
                          <div className="u-h-r-blood-type">
                            <BloodGroup bloodType={history.blood} size="24px" />
                          </div>
                        </pre>
                        <pre className="u-h-r-reason">
                          Reason :{" "}
                          <span style={{ color: "orangered" }}>
                            {history.reason}
                          </span>
                        </pre>
                      </div>
                    </div>
                  </div>
                  {history.status === "pending" ? (
                    <div className="u-h-r-action">
                      <span>Action</span>
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginTop: "4px",
                        }}
                        onClick={(e) => {
                          setInfoUpdate({
                            id: history.request_id,
                            blood_group: history.blood,
                            unit: history.unit,
                            reason: history.reason,
                          });
                          setUnitUpdate(history.unit);
                          setReasonUpdate(Reasons[0].value);
                          window.scrollTo(0, 500);
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
                          DeleteRequest(history.request_id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {history.status === "pending" ? (
                    <div className="u-h-r-status-pending">
                      <span className="u-h-r-status-text">Pending</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {history.status === "approved" ? (
                    <div className="u-h-r-status-approved">
                      <span className="u-h-r-status-text">Approved</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {history.status === "rejected" ? (
                    <div className="u-h-r-status-rejected">
                      <span className="u-h-r-status-text">Rejected</span>
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
            <div className="u-h-r-update">
              <h4>Request Update</h4>
              <form
                method="post"
                action=""
                className="u-h-r-form"
                onSubmit={(e) => e.defaultPrevented()}
              >
                {/* <div className="u-h-r-group u-h-r-blood-type">
                  <label className="u-h-r-label" htmlFor="u-h-r-bloodgroup">
                    Blood-type request
                  </label>
                  <Select
                    id="u-h-r-bloodgroup"
                    onChange={(e) => setBloodGroupUpdate(e.value)}
                    options={BloodType}
                    defaultValue={
                      BloodType[
                        BloodType.findIndex((a) => {
                          return a.value === infoUpdate.blood_group;
                        })
                      ]
                    }
                  />
                </div> */}
                <div className="u-h-r-group">
                  <label className="u-h-r-label" htmlFor="u-h-r-unit">
                    Unit (in ml)
                  </label>
                  <input
                    type="text"
                    id="u-h-r-unit"
                    name="unit"
                    onChange={(e) => {
                      setUnitUpdate(e.target.value);
                    }}
                    defaultValue={infoUpdate.unit}
                  />
                </div>

                <div className="u-h-r-group u-h-r-reason-name">
                  <label className="u-h-r-label" htmlFor="u-h-r-reason">
                    Reason
                  </label>
                  <Select
                    id="u-h-r-reason"
                    options={Reasons}
                    onChange={(e) => setHasOtherReason(e.value)}
                    defaultValue={Reasons[0]}
                    maxMenuHeight="160px"
                  />
                </div>

                {hasOtherReason === "Other" ? (
                  <div className="u-h-r-group ">
                    <label
                      className="u-h-r-label"
                      htmlFor="u-h-r-disease-other"
                    ></label>
                    <input
                      type="text"
                      id="u-h-r-disease-other"
                      name="unit"
                      onChange={(e) => {
                        setReasonUpdate(e.target.value);
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
                  className="u-h-r-form-close"
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

export default UserHistoryRequest;
