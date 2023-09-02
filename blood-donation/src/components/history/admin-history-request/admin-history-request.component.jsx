import "./admin-history-request.style.scss";

import Select from "react-select";
import Status from "../../../components/status/status.component";
import BloodGroup from "../../../components/blood-group/blood-group.component";
//import Gender from "../../../components/gender/gender.component";

import { Fragment, useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../../contexts/user.context";

import { Reasons, BloodType, State, SQLReasons } from "../../../sources/labels";

const order = [
  { value: "Censor_datetime desc", label: "Censor date" },
  { value: "Request_date desc", label: "Request date" },
  { value: "Name", label: "Name" },
  { value: "Dob", label: "Age" },
];

const filter = [
  { value: "all", label: "All" },
  { value: "Reason", label: "Reason" },
  { value: "Blood_group", label: "Blood-type" },
  { value: "Blood_group_suggestion", label: "Suggestion" },
  { value: "Lid", label: "Location" },
  { value: "Status", label: "Action" },
];

const heading = [
  "Name",
  "Age",
  "Reason",
  "Blood-type",
  "Suggestion",
  "Unit(ml)",
  "Request date",
  "Censor date",
  "Location",
  "Your Action",
];

const AdminHistoryRequest = () => {
  const { currentUser } = useContext(UserContext);

  const [aid, setAid] = useState();
  const [locationId, setLocationId] = useState([]);

  const [orderText, setOrderText] = useState("Censor_datetime desc");
  const [fieldFilterText, setFieldFilterText] = useState("all");
  const [contentFilterText, setContentFilterText] = useState("");
  const [requests, setRequests] = useState([]);

  const GetLocation = () => {
    fetch("http://localhost:3000/get-location", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocationId(
          data.map((location) => {
            return {
              value: location.Location_id,
              label: location.Address,
            };
          })
        );
      });
  };

  const GetAdminRequestHistory = useCallback(() => {
    if (fieldFilterText !== "all" && contentFilterText === "") return;
    fetch("http://localhost:3000/admin-request-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aid: aid,
        order: orderText,
        field: fieldFilterText,
        content: contentFilterText,
        reason : SQLReasons
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(
          data.map((history) => {
            return {
              name: history.Name,
              request_id: history.Request_id,
              request_date: history.Request_date,
              censor_date: history.Censor_datetime,
              unit: history.Unit,
              reason: history.Reason,
              blood_group: history.Blood_group,
              locationId: history.Lid,
              status: history.Status,
              dob: history.Dob,
              suggestion: history.Blood_group_suggestion,
            };
          })
        );
      });
  }, [aid, orderText, fieldFilterText, contentFilterText]);

  useEffect(() => {
    if (currentUser !== null) {
      setAid(currentUser.User_id);
    }
  }, [currentUser]);

  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    GetAdminRequestHistory();
  }, [GetAdminRequestHistory]);

  useEffect(() => {
    setContentFilterText("");
  }, [fieldFilterText]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === true ? (
        <div className="request-histories-details-container">
          <h2>Blood Request History</h2>
          <div className="request-histories-details-selector">
            <div className="request-histories-details-selector-constituent">
              <span>Order by</span>
              <Select
                defaultValue={order[0]}
                onChange={(e) => setOrderText(e.value)}
                options={order}
              />
            </div>
            <div className="request-histories-details-selector-constituent">
              <span>Filter</span>
              <Select
                defaultValue={filter[0]}
                onChange={(e) => setFieldFilterText(e.value)}
                options={filter}
              />
            </div>

            <div
              className="request-histories-selector-support"
              style={{ minWidth: "250px" }}
            >
              {fieldFilterText === "all" ? <Select /> : ""}
              {fieldFilterText === "" ? <Select /> : ""}
              {fieldFilterText === "Reason" ? (
                <Select
                  options={Reasons}
                  onChange={(e) => {
                    setContentFilterText(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilterText === "Blood_group" ? (
                <Select
                  options={BloodType}
                  onChange={(e) => {
                    setContentFilterText(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilterText === "Blood_group_suggestion" ? (
                <Select
                  options={BloodType}
                  onChange={(e) => {
                    setContentFilterText(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilterText === "Lid" ? (
                <Select
                  options={locationId}
                  onChange={(e) => {
                    setContentFilterText(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilterText === "Status" ? (
                <Select
                  options={State}
                  onChange={(e) => {
                    setContentFilterText(e.value);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="request-histories-details-table">
            <table>
              <thead>
                <tr>
                  {heading.map((heading, index) => {
                    return (
                      <th
                        className="request-histories-details-heading"
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
                          ? "request-histories-table-odd"
                          : "request-histories-table-even"
                      }
                      key={index}
                    >
                      <td>{val.name}</td>
                      {/* <td>
                        <Gender gender={val.gender} size="24px" />
                      </td> */}
                      <td>
                        {Math.floor(
                          (new Date() - new Date(val.dob)) /
                            (365 * 24 * 60 * 60 * 1000)
                        )}
                      </td>

                      <td
                        className={
                          val.reason !== "None"
                            ? "request-histories-reason"
                            : "request-histories-reason-none"
                        }
                      >
                        {val.reason}
                      </td>
                      <td>
                        <span>
                          <BloodGroup bloodType={val.blood_group} size="32px" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <BloodGroup bloodType={val.suggestion} size="32px" />
                        </span>
                      </td>
                      <td>{val.unit}</td>
                      <td>
                        {new Date(val.request_date).getDate()}/
                        {new Date(val.request_date).getMonth() + 1}/
                        {new Date(val.request_date).getFullYear()}
                      </td>
                      <td>
                        {new Date(val.censor_date).getDate()}/
                        {new Date(val.censor_date).getMonth() + 1}/
                        {new Date(val.censor_date).getFullYear()}
                      </td>
                      <td>
                        {
                          locationId.find((a) => a.value === val.locationId)
                            ?.label
                        }
                      </td>
                      <td className="request-histories-status">
                        <Status status={val.status} />
                      </td>
                      {/* <td>
                <button type="button" className="btn btn-outline-success">
                  Approve
                </button>
                <button type="button" className="btn btn-outline-danger">
                  Reject
                </button>
              </td> */}
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
                  <th></th>
                  <th className="request-histories-detail-total">
                    Total : {requests.length}
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

export default AdminHistoryRequest;
