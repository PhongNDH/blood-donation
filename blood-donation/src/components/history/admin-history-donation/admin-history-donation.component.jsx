import "./admin-history-donation.style.scss";

import { Fragment, useState, useEffect, useContext, useCallback } from "react";

import Select from "react-select";
import Status from "../../../components/status/status.component";
import BloodGroup from "../../../components/blood-group/blood-group.component";
//import Gender from "../../../components/gender/gender.component";

import { UserContext } from "../../../contexts/user.context";

import { Diseases, BloodType, State } from "../../../sources/labels";

const order = [
  { value: "Censor_datetime desc", label: "Censor date" },
  { value: "Donate_date desc", label: "Donate date" },
  { value: "Name", label: "Name" },
  { value: "Dob", label: "Age" },
];

const filter = [
  { value: "all", label: "All" },
  { value: "Disease", label: "Disease" },
  { value: "Blood_group", label: "Blood-type" },
  { value: "Lid", label: "Location" },
  { value: "Status", label: "Action" },
];

const heading = [
  "Name",
  "Age",
  "Disease",
  "Blood-type",
  "Unit(ml)",
  "Donate date",
  "Censor date",
  "Location",
  "Your Action",
];

const AdminHistoryDonation = () => {
  const { currentUser } = useContext(UserContext);

  const [aid, setAid] = useState();
  const [locationId, setLocationId] = useState([]);

  const [orderText, setOrderText] = useState("Censor_datetime desc");
  const [fieldFilterText, setFieldFilterText] = useState("all");
  const [contentFilterText, setContentFilterText] = useState("");
  const [donations, setDonations] = useState([]);

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

  const GetAdminDonationHistory = useCallback(() => {
    if (fieldFilterText !== "all" && contentFilterText === "") return;
    fetch("http://localhost:3000/admin-donation-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aid: aid,
        order: orderText,
        field: fieldFilterText,
        content: contentFilterText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDonations(
          data.map((history) => {
            return {
              name: history.Name,
              donate_id: history.Donate_id,
              donate_date: history.Donate_date,
              censor_date: history.Censor_datetime,
              unit: history.Unit,
              disease: history.Disease,
              blood_group: history.Blood_group,
              locationId: history.Lid,
              status: history.Status,
              dob: history.Dob,
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
    GetAdminDonationHistory();
  }, [GetAdminDonationHistory]);

  useEffect(() => {
    setContentFilterText("");
  }, [fieldFilterText]);

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === true ? (
        <div className="donation-histories-details-container">
          <h2>Blood Donation History</h2>
          <div className="donation-histories-details-selector">
            <div className="donation-histories-details-selector-constituent">
              <span>Order by</span>
              <Select
                defaultValue={order[0]}
                options={order}
                onChange={(e) => {
                  setOrderText(e.value);
                }}
              />
            </div>
            <div className="donation-histories-details-selector-constituent">
              <span>Filter</span>
              <Select
                defaultValue={filter[0]}
                onChange={(e) => setFieldFilterText(e.value)}
                options={filter}
              />
            </div>

            <div
              className="donation-histories-selector-support"
              style={{ minWidth: "250px" }}
            >
              {fieldFilterText === "all" ? <Select /> : ""}
              {fieldFilterText === "" ? <Select /> : ""}
              {fieldFilterText === "Disease" ? (
                <Select
                  options={Diseases}
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

          <div className="donation-histories-details-table">
            <table>
              <thead>
                <tr>
                  {heading.map((heading, index) => {
                    return (
                      <th
                        className="donation-histories-details-heading"
                        key={index}
                      >
                        {heading}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {donations.map((val, index) => {
                  return (
                    <tr
                      className={
                        index % 2 === 0
                          ? "donation-histories-table-odd"
                          : "donation-histories-table-even"
                      }
                      key={index}
                    >
                      {/* <td className="donation-histories-id">{val.id}</td> */}
                      <td>{val.name}</td>
                      <td>
                        {Math.floor(
                          (new Date() - new Date(val.dob)) /
                            (365 * 24 * 60 * 60 * 1000)
                        )}
                      </td>
                      {/* <td><Gender gender="male" size="24px"/></td> */}
                      <td
                        className={
                          val.disease !== "None"
                            ? "donation-histories-disease"
                            : "donation-histories-disease-none"
                        }
                      >
                        {val.disease}
                      </td>
                      <td>
                        <span>
                          <BloodGroup bloodType={val.blood_group} size="32px" />
                        </span>
                      </td>
                      <td>{val.unit}</td>
                      <td>
                        {new Date(val.donate_date).getDate()}/
                        {new Date(val.donate_date).getMonth() + 1}/
                        {new Date(val.donate_date).getFullYear()}
                      </td>
                      <td>
                        {new Date(val.censor_date).getDate()}/
                        {new Date(val.censor_date).getMonth() + 1}/
                        {new Date(val.censor_date).getFullYear()}
                      </td>
                      <td>
                        {
                          locationId.find((a) => a.value === val.locationId)
                            .label
                        }
                      </td>
                      <td className="donation-histories-status">
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
                  <th className="donation-histories-detail-total">
                    Total : {donations.length}
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

export default AdminHistoryDonation;
