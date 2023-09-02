import "./statistic.style.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { useEffect, Fragment, useState, useCallback } from "react";

import APlusImg from "../../assets/statistics/blood-type-A+.png";
import AMinusImg from "../../assets/statistics/blood-type-A-.png";
import BPlusImg from "../../assets/statistics/blood-type-B+.png";
import BMinusImg from "../../assets/statistics/blood-type-B-.png";
import OPlusImg from "../../assets/statistics/blood-type-0+.png";
import OMinusImg from "../../assets/statistics/blood-type-0-.png";
import ABPlusImg from "../../assets/statistics/blood-type-AB+.png";
import ABMinusImg from "../../assets/statistics/blood-type-AB-.png";
import TotalDonorsImg from "../../assets/statistics/users-group.png";
//import TotalRequestImg from "../../assets/statistics/spinner-of-dots.png";
import TotalApprovedImg from "../../assets/statistics/check.png";
import TotalUnitImg from "../../assets/statistics/blood-donor.png";

import LocationImg from "../../assets/home/maps-and-flags.png";

const Statistics = () => {
  const animatedComponents = makeAnimated();

  const [bloodTypeLocationValues, setBloodTypeLocationValues] = useState([]);
  const [requestLocationValues, setRequestTypeLocationValues] = useState([]);

  const [location, setLocation] = useState([]);
  const [locationId, setLocationId] = useState([]);

  const [statisticLocation, setStatisticLocation] = useState([
    {
      APlus: 0,
      AMinus: 0,
      BPlus: 0,
      BMinus: 0,
      ABPlus: 0,
      ABMinus: 0,
      OPlus: 0,
      OMinus: 0,
    },
  ]);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalApprovedRequests, setTotalApprovedRequests] = useState(0);

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
              value: location.Location_name,
              locationId: location.Location_id,
            };
          })
        );
      });
  };
  const GetBloodGroupStatistic = useCallback(() => {
    fetch(
      `http://localhost:3000/blood-type-statistics/${
        bloodTypeLocationValues.length > 0 ? bloodTypeLocationValues : 0
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStatisticLocation(
          data.map((blood) => {
            return {
              APlus: blood.A_Plus === null ? 0 : blood.A_Plus,
              AMinus: blood.A_Minus === null ? 0 : blood.A_Minus,
              BPlus: blood.B_Plus === null ? 0 : blood.B_Plus,
              BMinus: blood.B_Minus === null ? 0 : blood.B_Minus,
              ABPlus: blood.AB_Plus === null ? 0 : blood.AB_Plus,
              ABMinus: blood.AB_Minus === null ? 0 : blood.AB_Minus,
              OPlus: blood.O_Plus === null ? 0 : blood.O_Plus,
              OMinus: blood.O_Minus === null ? 0 : blood.O_Minus,
            };
          })
        );
      });
  }, [bloodTypeLocationValues]);

  const GetTotalDonors = useCallback(() => {
    fetch(
      `http://localhost:3000/get-total-donors/${
        requestLocationValues.length > 0 ? requestLocationValues : 0
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalDonors(data[0].Total_donors);
      });
  }, [requestLocationValues]);

  const GetTotalUnits = useCallback(() => {
    fetch(
      `http://localhost:3000/get-total-units/${
        requestLocationValues.length > 0 ? requestLocationValues : 0
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalUnits(data === null ? 0 : data[0].Total_units);
      });
  }, [requestLocationValues]);

  const GetTotalApprovedRequest = useCallback(() => {
    fetch(
      `http://localhost:3000/get-total-requests/${
        requestLocationValues.length > 0 ? requestLocationValues : 0
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalApprovedRequests(data[0].Total_requests);
      });
  }, [requestLocationValues]);

  useEffect(() => {
    GetLocation();
  }, []);

  useEffect(() => {
    GetBloodGroupStatistic();
  }, [GetBloodGroupStatistic]);

  useEffect(() => {
    GetTotalDonors();
  }, [GetTotalDonors]);

  useEffect(() => {
    GetTotalUnits();
  }, [GetTotalUnits]);

  useEffect(() => {
    GetTotalApprovedRequest();
  }, [GetTotalApprovedRequest]);

  const handleBloodTypeLocationChange = (e) => {
    setBloodTypeLocationValues(
      Array.isArray(e)
        ? e.map(
            (x) =>
              locationId.find((location) => {
                return location.value === x.value;
              }).locationId
          )
        : []
    );
  };

  const handleRequestLocationChange = (e) => {
    setRequestTypeLocationValues(
      Array.isArray(e)
        ? e.map(
            (x) =>
              locationId.find((location) => {
                return location.value === x.value;
              }).locationId
          )
        : []
    );
  };

  return (
    <Fragment>
      <div className="statistics-container">
        <p className="blood-type-statistics">Blood-type Statistics</p>
        <div className="blood-type-statistics-location">
          <img src={LocationImg} alt="" />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            //value={locations.filter((obj) => selectedValues.includes(obj.value))}
            isMulti
            options={location}
            placeholder="Select location"
            onChange={handleBloodTypeLocationChange}
          />
        </div>

        <div className="statistics-blood-style-container">
          <div className="statistics-A+">
            <img src={APlusImg} alt="" />
            <h4>{statisticLocation[0].APlus / 1000} L</h4>
          </div>
          <div className="statistics-A-">
            <img src={AMinusImg} alt="" />
            <h4>{statisticLocation[0].AMinus / 1000} L</h4>
          </div>
          <div className="statistics-B+">
            <img src={BPlusImg} alt="" />
            <h4>{statisticLocation[0].BPlus / 1000} L</h4>
          </div>
          <div className="statistics-B-">
            <img src={BMinusImg} alt="" />
            <h4>{statisticLocation[0].BMinus / 1000} L</h4>
          </div>
          <div className="statistics-O+">
            <img src={OPlusImg} alt="" />
            <h4>{statisticLocation[0].OPlus / 1000} L</h4>
          </div>
          <div className="statistics-O-">
            <img src={OMinusImg} alt="" />
            <h4>{statisticLocation[0].OMinus / 1000} L</h4>
          </div>
          <div className="statistics-AB+">
            <img src={ABPlusImg} alt="" />
            <h4>{statisticLocation[0].ABPlus / 1000} L</h4>
          </div>
          <div className="statistics-AB-">
            <img src={ABMinusImg} alt="" />
            <h4>{statisticLocation[0].ABMinus / 1000} L</h4>
          </div>
        </div>

        <p className="request-statistics">Request Statistics</p>
        <div className="request-statistics-location">
          <img src={LocationImg} alt="" />
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            //value={locations.filter((obj) => selectedValues.includes(obj.value))}
            isMulti
            options={location}
            placeholder="Select location"
            onChange={handleRequestLocationChange}
          />
        </div>
        <div className="statistics-information">
          <div className="statistics-donor">
            <img src={TotalDonorsImg} alt="" />
            <span>Total Donors</span>
            <h4>{totalDonors}</h4>
          </div>

          <div className="statistics-approved">
            <img src={TotalApprovedImg} alt="" />
            <span>Approved Requests</span>
            <h4>{totalApprovedRequests}</h4>
          </div>

          <div className="statistics-unit">
            <img src={TotalUnitImg} alt="" />
            <span>Total Blood Units &#40;L&#41;</span>
            <h4>{totalUnits / 1000} </h4>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Statistics;
