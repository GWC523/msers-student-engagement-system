import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Error.css";

function InputError({ isValid, message }) {
  if (!isValid) {
    return <></>;
  } else {
    return (
      <div className="validity-error callout bottom">
        <FontAwesomeIcon
          icon={"exclamation-triangle"}
          alt={"warning"}
          aria-hidden="true"
          className="error-icon"
        />
        {message}
      </div>
    );
  }
}

export default InputError;
