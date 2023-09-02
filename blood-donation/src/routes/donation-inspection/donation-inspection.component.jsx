import "./donation-inspection.style.scss";
import Select from "react-select";
import { Fragment, useState, useEffect, useCallback, useContext } from "react";
//import Status from "../../components/status/status.component";
import BloodGroup from "../../components/blood-group/blood-group.component";
//import Gender from "../../components/gender/gender.component";

import { BloodType } from "../../sources/labels.js";
import { UserContext } from "../../contexts/user.context";
import { BloodTypeAndSQLName } from "../../sources/labels.js";

const order = [
  { value: "Donate_date", label: "Donate date" },
  { value: "Name", label: "Name" },
];

const filter = [
  { value: "all", label: "All" },
  { value: "Disease", label: "Disease" },
  { value: "Lid", label: "Location" },
  { value: "Blood_group", label: "Blood-type" },
];

const heading = [
  "Name",
  "Age",
  "Disease",
  "Blood-type",
  "Unit (ml)",
  "Donate date",
  "Location",
  "Action",
];

const Diseases = [
  { value: "None", label: "None" },
  { value: "Have", label: "Have" },
];

const DonationInspection = () => {
  const { currentUser } = useContext(UserContext);
  const [adminId, setAdminId] = useState();
  //const [filterText, setFilterText] = useState("");
  const [location, setLocation] = useState([]);
  const [locationId, setLocationId] = useState([]);
  const [donations, setDonations] = useState([]);

  const [orderText, setOrderText] = useState("Donate_date");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("");

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
              value: location.Location_name,
              label: location.Address,
            };
          })
        );
        setLocationId(
          data.map((location) => {
            return {
              id: location.Location_id,
              name: location.Location_name,
              address: location.Address,
            };
          })
        );
      });
  };
  const GetDonationDetail = useCallback(() => {
    if (fieldFilter !== "all" && contentFilter === "") return;
    fetch("http://localhost:3000/admin-get-donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: orderText,
        field: fieldFilter,
        content: contentFilter,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDonations(
          data.map((donation) => {
            return {
              donate_id: donation.Donate_id,
              uid : donation.User_id,
              name: donation.Name,
              age: Math.floor(
                (new Date() - new Date(donation.Dob)) /
                  (365 * 24 * 60 * 60 * 1000)
              ),
              disease: donation.Disease,
              blood_type: donation.Blood_group,
              date: donation.Donate_date,
              location: donation.Lid,
              status: donation.Status,
              unit: donation.Unit,
            };
          })
        );
      });
  }, [orderText, fieldFilter, contentFilter]);
  
  const RejectDonation = (donate_id) => {
    fetch(`http://localhost:3000/admin-reject-donation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donate_id: donate_id,
        aid: adminId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Success") {
          alert("Reject successfully");
          GetDonationDetail();
        }
      });
  };

  const ApproveDonation = (donate_id, location, unit, blood_group, uid) => {
    fetch(`http://localhost:3000/admin-approve-donation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aid: adminId,
        donate_id: donate_id,
        lid: location,
        unit : unit,
        blood_group : (BloodTypeAndSQLName.find((value) => value.blood_type === blood_group)).name,
        uid : uid
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Success") {
          alert("Approve successfully");
          GetDonationDetail();
        }
      });
  };



  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    GetDonationDetail();
  }, [GetDonationDetail]);

  useEffect(() => {
    setContentFilter("");
  }, [fieldFilter]);

  useEffect(() => {
    if (currentUser !== null) {
      setAdminId(currentUser.User_id);
    }
  }, [currentUser]);

  const OnOrderChange = (e) => {
    setOrderText(e.value);
  };

  const OnFieldFilterChange = (e) => {
    setFieldFilter(e.value);
  };

  return (
    <Fragment>
      {currentUser !== null && currentUser.IsAdmin === true ? (
        <div className="donation-details-container">
          <h2>Blood Donation Details</h2>
          <div className="donation-details-selector">
            <div className="donation-details-selector-constituent">
              <span>Order by</span>
              <Select
                options={order}
                defaultValue={order[0]}
                onChange={OnOrderChange}
              />
            </div>
            <div className="donation-details-selector-constituent">
              <span>Filter</span>
              <Select
                onChange={OnFieldFilterChange}
                options={filter}
                defaultValue={filter[0]}
              />
            </div>
            <div
              className="donation-details-selector-support"
              style={{ minWidth: "250px" }}
            >
              {fieldFilter === "all" ? <Select /> : ""}
              {fieldFilter === "" ? <Select /> : ""}
              {fieldFilter === "Disease" ? (
                <Select
                  options={Diseases}
                  onChange={(e) => {
                    setContentFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {fieldFilter === "Lid" ? (
                <Select
                  options={location}
                  onChange={(e) => {
                    setContentFilter(
                      locationId?.find((location) => {
                        return location.name === e.value;
                      })?.id
                    );
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

          <div className="donation-details-table">
            <table>
              <thead>
                <tr>
                  {heading.map((heading, index) => {
                    return (
                      <th className="donation-details-heading" key={index}>
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
                          ? "donation-table-odd"
                          : "donation-table-even"
                      }
                      key={index}
                    >
                      <td>{val.name}</td>
                      <td>{val.age}</td>
                      {/* <td>{val.age}</td>
                    <td>
                      <Gender gender={val.gender} size="24px" />
                    </td> */}
                      <td
                        className={
                          val.disease !== "None"
                            ? "donation-disease"
                            : "donation-disease-none"
                        }
                      >
                        {val.disease}
                      </td>
                      <td>
                        <span>
                          <BloodGroup bloodType={val.blood_type} size="32px" />
                        </span>
                      </td>
                      <td>{val.unit}</td>
                      <td>
                        {new Date(val.date).getDate()}/
                        {new Date(val.date).getMonth() + 1}/
                        {new Date(val.date).getFullYear()}
                      </td>
                      <td>
                        {
                          locationId?.find((location) => {
                            return location.id === val.location;
                          })?.address
                        }
                      </td>
                      {/* <td className="donation-status">
                      <Status status={val.status} />
                    </td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => {
                            ApproveDonation(val.donate_id, val.location, val.unit, val.blood_type, val.uid);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            RejectDonation(val.donate_id);
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
                  <th className="donation-detail-total">
                    Total donations : {donations.length}
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

export default DonationInspection;
