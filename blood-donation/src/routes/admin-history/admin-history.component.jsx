import "./admin-history.style.scss";
import { Fragment } from "react";

import AdminHistoryDonation from "../../components/history/admin-history-donation/admin-history-donation.component";
import AdminHistoryRequest from "../../components/history/admin-history-request/admin-history-request.component";

const AdminHistory = () => {
  return (
    <Fragment>
      <div className="admin-history-container">
        <AdminHistoryDonation />
        <AdminHistoryRequest />
      </div>
    </Fragment>
  );
};

export default AdminHistory;
