import "./request-inspection.style.scss";
import Select from "react-select";
//import Status from "../../components/status/status.component";

import { Fragment, useState, useCallback, useEffect, useContext } from "react";

import BloodGroup from "../../components/blood-group/blood-group.component";
// import Gender from "../../components/gender/gender.component";
import { UserContext } from "../../contexts/user.context";

import {
  Reasons,
  BloodType,
  BloodRecieved,
  BloodTypeAndSQLName,
  SQLReasons
} from "../../sources/labels";

const order = [
  { value: "Request_date", label: "Request date" },
  { value: "Name", label: "Name" },
];

const filter = [
  { value: "all", label: "All" },
  { value: "Reason", label: "Reason" },
  { value: "Blood_group", label: "Blood-type" },
];

const heading = [
  "Name",
  "Age",
  "Reason",
  "Blood-type",
  "Request date",
  "Suggestion",
  "Unit (ml)",
  "Location",
  "Action",
];

const RequestInspection = () => {
  const { currentUser } = useContext(UserContext);
  const [adminId, setAdminId] = useState();

  const [orderText, setOrderText] = useState("Request_date");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("");

  // const [location, setLocation] = useState([]);
  // const [locationId, setLocationId] = useState([]);
  const [requests, setRequests] = useState([]);

  var [selectedLocation, setSelectedLocation] = useState("");

  const GetRequestDetail = useCallback(() => {
    if (fieldFilter !== "all" && contentFilter === "") return;
    fetch("http://localhost:3000/admin-get-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: orderText,
        field: fieldFilter,
        content: contentFilter,
        reason :SQLReasons
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(
          data.map((request) => {
            return {
              request_id: request.Request_id,
              name: request.Name,
              age: Math.floor(
                (new Date() - new Date(request.Dob)) /
                  (365 * 24 * 60 * 60 * 1000)
              ),
              unit: request.Unit,
              reason: request.Reason,
              blood_group: request.Blood_group,
              date: request.Request_date,
              status: request.Status,
              suggestion: "",
              locations: [],
              location: "",
            };
          })
        );
      });
  }, [orderText, fieldFilter, contentFilter]);

  const RejectRequest = (request_id) => {
    fetch(`http://localhost:3000/admin-reject-request`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: request_id,
        aid: adminId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Success") {
          alert("Reject successfully");
          GetRequestDetail();
        }
      });
  };

  const ApproveRequest = (request_id, location, unit, blood_group) => {
    fetch(`http://localhost:3000/admin-approve-request`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aid: adminId,
        request_id: request_id,
        lid: location,
        unit: unit,
        blood_group: blood_group,
        blood_type: BloodTypeAndSQLName.find((a) => a.name === blood_group)
          ?.blood_type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Success") {
          alert("Approve successfully");
          GetRequestDetail();
        }
      });
  };

  useEffect(() => {
    GetRequestDetail();
  }, [GetRequestDetail]);

  useEffect(() => {
    setContentFilter("");
  }, [fieldFilter]);

  useEffect(() => {
    setSelectedLocation("");
  }, [requests]);

  useEffect(() => {
    if (currentUser !== null) {
      setAdminId(currentUser.User_id);
    }
  }, [currentUser]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === true ? (
        <div className="request-inspection-details-container">
          <h2>Blood Request Details</h2>
          <div className="request-inspection-details-selector">
            <div className="request-inspection-details-selector-constituent">
              <span>Order by</span>
              <Select
                defaultValue={order[0]}
                options={order}
                onChange={(e) => {
                  setOrderText(e.value);
                }}
              />
            </div>
            <div className="request-inspection-details-selector-constituent">
              <span>Filter</span>
              <Select
                defaultValue={filter[0]}
                onChange={(e) => setFieldFilter(e.value)}
                options={filter}
              />
            </div>

            <div
              className="request-details-selector-support"
              style={{ minWidth: "250px" }}
            >
              {fieldFilter === "all" ? <Select /> : ""}
              {fieldFilter === "" ? <Select /> : ""}
              {fieldFilter === "Reason" ? (
                <Select
                  options={Reasons}
                  onChange={(e) => {
                    setContentFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilter === "Blood_group" ? (
                <Select
                  options={BloodType}
                  onChange={(e) => {
                    setContentFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="request-inspection-details-table">
            <table>
              <thead>
                <tr>
                  {heading.map((heading, index) => {
                    return (
                      <th
                        className="request-inspection-details-heading"
                        key={index}
                      >
                        {heading}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {requests.map((val, index) => {
                  return (
                    <tr
                      className={
                        index % 2 === 0
                          ? "request-inspection-table-odd"
                          : "request-inspection-table-even"
                      }
                      key={index}
                    >
                      <td>{val.name}</td>
                      <td>{val.age}</td>

                      {/* <td><Gender gender={val.gender} size="24px"/></td> */}
                      <td className="request-inspection-reason">
                        {val.reason}
                      </td>
                      <td>
                        <span>
                          <BloodGroup bloodType={val.blood_group} size="32px" />
                        </span>
                      </td>
                      <td>
                        {new Date(val.date).getDate()}/
                        {new Date(val.date).getMonth() + 1}/
                        {new Date(val.date).getFullYear()}
                      </td>

                      {/* <td className="request-inspection-status">
                      <Status status={val.status} />
                    </td> */}
                      <td className="request-inspection-blood-type-suggestion">
                        <Select
                          options={
                            BloodRecieved.find(
                              (a) => a.blood_type === val.blood_group
                            ).received
                          }
                          maxMenuHeight="80px"
                          onChange={(e) => {
                            val.suggestion = e.value;
                            fetch(
                              "http://localhost:3000/admin-get-available-location",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  blood_group: val.suggestion,
                                  unit: val.unit,
                                }),
                              }
                            )
                              .then((res) => res.json())
                              .then((data) => {
                                val.locations = data.map((location) => {
                                  return {
                                    value: location.Location_id,
                                    label: location.Address,
                                  };
                                });
                                //GetRequestDetail();
                                setSelectedLocation(val.locations);
                              });
                          }}
                        />
                      </td>
                      <td>{val.unit}</td>
                      <td className="request-inspection-location">
                        <Select
                          maxMenuHeight="80px"
                          isClearable="true"
                          options={val.locations}
                          onChange={(e) => {
                            val.location = e.value;
                            //setSelectedLocation(val.location);
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => {
                            if (val.suggestion === "" || val.location === "") {
                              alert("Please select a suggestion and location");
                              return;
                            }
                            ApproveRequest(
                              val.request_id,
                              val.location,
                              val.unit,
                              val.suggestion
                            );
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            RejectRequest(val.request_id);
                          }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="request-inspection-detail-total">
                    Total requests : {requests.length}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default RequestInspection;
