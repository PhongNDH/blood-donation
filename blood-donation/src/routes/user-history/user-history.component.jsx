import "./user-history.style.scss";

import { Fragment } from "react";

import UserHistoryDonation from "../../components/history/user-history-donation/user-history-donation.component";
import UserHistoryRequest from "../../components/history/user-history-request/user-history-request.component";

const UserHistory = () => {
  return (
    <Fragment>
      <div className="user-history-container">
        <UserHistoryDonation />
        <UserHistoryRequest />
      </div>
    </Fragment>
  );
};

export default UserHistory;
