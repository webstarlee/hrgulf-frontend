import React, {Fragment} from "react";

import "./Error.scss";

export default ({heading, message}) => {
  return (
    <Fragment>
      <div className="match-parent">
        <div className="top-p50 error-indicator" role="status">
          <h1 className="text-center">{heading}</h1>
          <h4 className="text-center">{message}</h4>
        </div>
      </div>
    </Fragment>
  );
}