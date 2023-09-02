import "./status.style.scss";
import { Fragment } from "react";

const Status = ({ status }) => {
  return (
    <Fragment>
      {status === "approved" ? (
        <div className="status-approved">Approved</div>
      ) : (
        ""
      )}
      {status === "rejected" ? (
        <div className="status-reject">Rejected</div>
      ) : (
        ""
      )}
      {status === "pending" ? (
        <div className="status-pending">Pending</div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Status;
