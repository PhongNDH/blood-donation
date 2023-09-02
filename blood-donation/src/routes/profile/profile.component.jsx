import "./profile.style.scss";
//import ProfileImg from "../../assets/home/profile.png";
import MaleUserImg from "../../assets/home/user_male_icon.png";
import FemaleUserImg from "../../assets/home/user_female_icon.png";
import HomeImg from "../../assets/home/home.png";

import BloodGroup from "../../components/blood-group/blood-group.component";
import Select from "react-select";

import { useContext, Fragment, useState, useEffect, useCallback } from "react";
import { UserContext } from "../../contexts/user.context";
import { Link } from "react-router-dom";

const status = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const Profile = () => {
  const { currentUser } = useContext(UserContext);

  const [donationFilter, setDonationFilter] = useState("all");
  const [requestFilter, setRequestFilter] = useState("all");

  const [donationTimes, setDonationTimes] = useState();
  const [requestTimes, setRequestTimes] = useState();
  const [giftStatistic, setGiftStatistic] = useState();

  const GetDonationTime = useCallback(() => {
    fetch(
      `http://localhost:3000/get-donation-times/${currentUser.User_id}/${donationFilter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDonationTimes(data.Numbers);
      });
  }, [currentUser, donationFilter]);

  const GetRequestTime = useCallback(() => {
    fetch(
      `http://localhost:3000/get-request-times/${currentUser.User_id}/${requestFilter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setRequestTimes(data.Numbers);
      });
  }, [currentUser, requestFilter]);

  const GetGiftStatistic = useCallback(() => {
    fetch(`http://localhost:3000/get-gift-statistics/${currentUser.User_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setGiftStatistic(
          data.map((gift) => {
            return {
              name: gift.Gname,
              point: gift.Point,
              quantity: gift.Quantity,
            };
          })
        );
      });
  }, [currentUser]);

  useEffect(() => {
    GetDonationTime();
  }, [GetDonationTime]);

  useEffect(() => {
    GetRequestTime();
  }, [GetRequestTime]);

  useEffect(() => {
    GetGiftStatistic();
  }, [GetGiftStatistic]);

  return (
    <Fragment>
      {currentUser == null ? (
        ""
      ) : (
        <div className="profile-container">
          <div className="profile-heading">
            <div className="profile-heading--name">
              <img
                src={
                  currentUser.Gender === "male" ? MaleUserImg : FemaleUserImg
                }
                alt="Profile"
                width="50px"
                height="50px"
              />
              <span>{currentUser.Name}</span>
            </div>
            <Link to="/home">
              <img className="profile-return-home" src={HomeImg} alt="Profile" width="45px" height="45px" />
            </Link>
          </div>
          <div className="profile-info">
            {currentUser.IsAdmin === true ? (
              ""
            ) : (
              <Fragment>
                <div className="profile-statistic">
                  <div className="profile-statistic-component profile-statistic-donation">
                    <h4>Number of donations</h4>
                    <div className="profile_statistic-element">
                      <div className="profile-statistic-select">
                        <h6>Status </h6>
                        <Select
                          options={status}
                          defaultValue={status[0]}
                          onChange={(e) => {
                            setDonationFilter(e.value);
                          }}
                        />
                      </div>
                      <div className="profile-statistic-total">
                        <h6>Total </h6>
                        <span>{donationTimes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-statistic-component profile-statistic-request">
                    <h4>Number of requests</h4>
                    <div className="profile_statistic-element">
                      <div className="profile-statistic-select">
                        <h6>Status </h6>
                        <Select
                          options={status}
                          defaultValue={status[0]}
                          onChange={(e) => {
                            setRequestFilter(e.value);
                          }}
                        />
                      </div>
                      <div className="profile-statistic-total">
                        <h6>Total </h6>
                        <span>{requestTimes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            )}

            <div className="profile-detail profile_id">
              <h4>Id</h4>
              <span className="profile-point">{currentUser.PrefixedID}</span>
            </div>
            <div className="profile-detail profile_email">
              <h4>Email</h4>
              <span>{currentUser.Email}</span>
            </div>
            <div className="profile-detail profile_phone-number">
              <h4>Phone number</h4>
              <span>{currentUser.Phone_number}</span>
            </div>
            <div className="profile-detail profile_birthdate">
              <h4>Date of birth</h4>
              <span>
                {new Date(currentUser.Dob).getDate()}/
                {new Date(currentUser.Dob).getMonth() + 1}/
                {new Date(currentUser.Dob).getFullYear()}
              </span>
            </div>
            <div className="profile-detail profile_blood-type">
              <h4>Blood-type</h4>
              <p className="profile_blood-type-img">
                <BloodGroup bloodType={currentUser.Blood_group} size="28px" />
              </p>
            </div>
            {currentUser.IsAdmin === true ? (
              ""
            ) : (
              <div className="profile-detail profile_point">
                <h4>Point</h4>
                <p className="profile-point">{currentUser.Point}</p>
              </div>
            )}
            {currentUser.IsAdmin === true ? (
              ""
            ) : (
              <div className="profile-detail profile_gift">
                <h4>Your gifts</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Gift name</th> <th>Point needed</th> <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {giftStatistic?.map((gift, index) => {
                      return (
                        <tr key={index}>
                          <td>{gift.name}</td>
                          <td>{gift.point}</td>
                          <td>{gift.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
