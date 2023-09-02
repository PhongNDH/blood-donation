import "./user-details.style.scss";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Fragment, useState, useEffect, useCallback } from "react";
import BloodGroup from "../../components/blood-group/blood-group.component";
import Gender from "../../components/gender/gender.component";
import { BloodType } from "../../sources/labels";

const order = [
  { value: "Register_datetime", label: "Register date" },
  { value: "Name", label: "Name" },
  { value: "Dob", label: "Age" },
  { value: "Donated_amount desc", label: "Amount of blood donated" },
  { value: "Requested_amount desc", label: "Amount of blood received " },
  { value: "Point desc", label: "Point" },
];

const filter = [
  //{ value: "gender", label: "Gender" },
  { value: "bloodType", label: "Blood-type" },
  { value: "age", label: "Age" },
  { value: "dlocation", label: "Donate location" },
  { value: "rlocation", label: "Received location" },
  { value: "dunit", label: "Blood donated" },
  { value: "runit", label: "Blood received" },
];

const ageLabel = [
  { value: 18, label: "Under 18" },
  { value: 60, label: "From 18 to 60" },
  { value: 61, label: "Over 60" },
];

const heading = [
  "Name",
  "Gender",
  "Age",
  "Phone number",
  "Blood-type",
  "Donated blood (ml)",
  "Requested blood (ml)",
  "Point",
];

// const donor = [
//   {
//     Id: 1,
//     Name: "John",
//     Gender: "male",
//     Age: 21,
//     PhoneNumber: "0234234222",
//     Disease: "None",
//     BloodType: "A-",
//     Point: 1,
//   },
//   {
//     Id: 2,
//     Name: "Calvin",
//     Gender: "male",
//     Age: 26,
//     PhoneNumber: "0789266222",
//     Disease: "Hepatis B",
//     BloodType: "O-",
//     Point: 2,
//   },
//   {
//     Id: 3,
//     Name: "Linda",
//     Gender: "female",
//     Age: 20,
//     PhoneNumber: "0867435623",
//     Disease: "Hepatis A",
//     BloodType: "A+",
//     Point: 0,
//   },
//   {
//     Id: 3,
//     Name: "Linda",
//     Gender: "female",
//     Age: 20,
//     PhoneNumber: "0867435623",
//     Disease: "Hepatis A",
//     BloodType: "A+",
//     Point: 0,
//   },
//   {
//     Id: 3,
//     Name: "Linda",
//     Gender: "female",
//     Age: 20,
//     PhoneNumber: "0867435623",
//     Disease: "Hepatis A",
//     BloodType: "A+",
//     Point: 0,
//   },
//   {
//     Id: 3,
//     Name: "Linda",
//     Gender: "female",
//     Age: 20,
//     PhoneNumber: "0867435623",
//     Disease: "Hepatis A",
//     BloodType: "A+",
//     Point: 0,
//   },
//   {
//     Id: 3,
//     Name: "Linda",
//     Gender: "female",
//     Age: 20,
//     PhoneNumber: "0867435623",
//     Disease: "Hepatis A",
//     BloodType: "A+",
//     Point: 0,
//   },
// ];

const UserDetail = () => {
  const animatedComponents = makeAnimated();
  const [donors, setDonors] = useState([]);

  const [locationId, setLocationId] = useState();

  const [filterText, setFilterText] = useState([]);
  const [bloodTypeFilter, setBloodTypeFilter] = useState("");
  //const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [dlocationFilter, setDLocationFilter] = useState("");
  const [rlocationFilter, setRLocationFilter] = useState("");
  const [donationUnit, setDonationUnit] = useState(0);
  const [recievedUnit, setRecievedUnit] = useState(0);
  const [orderText, setOrderText] = useState("Register_datetime");

  const GetUserDetail = useCallback(() => {
    if(donationUnit < 0 || recievedUnit < 0) return;
    fetch("http://localhost:3000/user-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: orderText,
        age: ageFilter,
        blood_type: bloodTypeFilter,
        donate_location: dlocationFilter,
        request_location: rlocationFilter,
        donate_unit : donationUnit,
        request_unit : recievedUnit,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDonors(
          data.map((donor) => {
            return {
              name: donor.Name,
              gender: donor.Gender,
              age: Math.floor(
                (new Date() - new Date(donor.Dob)) / (365 * 24 * 60 * 60 * 1000)
              ),
              phone_number: donor.Phone_number,
              blood_type: donor.Blood_group,
              point: donor.Point,
              donate_amount: donor.Donated_amount,
              request_amount: donor.Requested_amount,
            };
          })
        );
      });
  }, [orderText, ageFilter, bloodTypeFilter, dlocationFilter,rlocationFilter, donationUnit, recievedUnit]);

  const GetLocation = () => {
    fetch("http://localhost:3000/get-location", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // setLocations(
        //   data.map((location) => {
        //     return {
        //       value: location.Location_name,
        //       label: location.Address,
        //     };
        //   })
        // );
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

  const HandleFilterChange = (e) => {
    setFilterText(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    GetUserDetail();
  }, [GetUserDetail]);

  useEffect(() => {
    // if (!filterText.includes("gender")) {
    //   setGenderFilter("");
    // }
    if (!filterText.includes("age")) {
      setAgeFilter("");
    }
    if (!filterText.includes("bloodType")) {
      setBloodTypeFilter("");
    }
    if (!filterText.includes("dlocation")) {
      setDLocationFilter("");
    }
    if (!filterText.includes("rlocation")) {
      setRLocationFilter("");
    }
    if (!filterText.includes("runit")) {
      setRecievedUnit(0);
    }
    if (!filterText.includes("dunit")) {
      setDonationUnit(0);
    }
  }, [filterText]);

  return (
    <Fragment>
      <div className="user-details-container">
        <h2>User details</h2>
        <div className="user-details-selector">
          <div className="user-details-search">
            <div className="user-details-order-filter">
              <div className="user-details-selector-constituent">
                <span>Order by</span>
                <Select
                  onChange={(e) => {
                    setOrderText(e.value);
                  }}
                  options={order}
                  defaultValue={order[0]}
                />
              </div>
              <div className="user-details-selector-constituent user-details-selector-constituent-filter">
                <span>Filter</span>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={filter}
                  placeholder="Select ..."
                  onChange={HandleFilterChange}
                />
              </div>
            </div>

            <div
              className="user-details-selector-support"
              style={{ minWidth: "250px" }}
            >
              {/* {/* {filterText === "all" ? <Select /> : ""} */}
              {/* {filterText.includes("gender") ? (
                <Select
                  options={GenderType}
                  placeholder="Select gender"
                  onChange={(e) => {
                    setGenderFilter(e.value);
                  }}
                />
              ) : (
                ""
              )} */}
              {filterText.includes("age") ? (
                <Select
                  options={ageLabel}
                  placeholder="Select age"
                  onChange={(e) => {
                    setAgeFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {filterText.includes("bloodType") ? (
                <Select
                  options={BloodType}
                  placeholder="Select blood-type"
                  onChange={(e) => {
                    setBloodTypeFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {filterText.includes("dlocation") ? (
                <Select
                  options={locationId}
                  placeholder="Select donation location"
                  onChange={(e) => {
                    setDLocationFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {filterText.includes("rlocation") ? (
                <Select
                  options={locationId}
                  placeholder="Select received location"
                  onChange={(e) => {
                    setRLocationFilter(e.value);
                  }}
                />
              ) : (
                ""
              )}
              {filterText.includes("dunit") ? (
                <input
                  type="number"
                  id="donate-disease-other"
                  name="unit"
                  placeholder="Blood donation (over) "
                  style={{outlineColor :"##007aff", padding : '2px 8px' ,height : "36px"}}
                  onChange={(e) => {
                    setDonationUnit(e.target.value);
                  }}
                />
              ) : (
                ""
              )}
              {filterText.includes("runit") ? (
                <input
                  type="number"
                  id="donate-disease-other"
                  name="unit"
                  placeholder="Blood received (over)"
                  style={{outlineColor :"##007aff", padding : '2px 8px' ,height : "36px"}}
                  onChange={(e) => {
                    setRecievedUnit(e.target.value);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="user-details-table">
          <table>
            <thead>
              <tr>
                {heading.map((heading, index) => {
                  return (
                    <th className="user-details-heading" key={index}>
                      {heading}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {donors.map((val, index) => {
                return (
                  <tr
                    className={
                      index % 2 === 0 ? "user-table-odd" : "user-table-even"
                    }
                    key={index}
                  >
                    <td>{val.name}</td>
                    <td>
                      <Gender gender={val.gender} size="24px" />
                    </td>
                    <td>{val.age}</td>
                    <td>{val.phone_number}</td>
                    <td>
                      <span>
                        <BloodGroup bloodType={val.blood_type} size="32px" />
                      </span>
                    </td>
                    <td>{val.donate_amount}</td>
                    <td>{val.request_amount}</td>
                    <td>{val.point}</td>
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
                <th className="user-detail-total">
                  Total users : {donors.length}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default UserDetail;
