import React from "react";
import { Alert } from "@material-ui/lab";

const AlertBox = ({ errorMessage, severity }) => {
  return errorMessage && <Alert severity={severity}>{errorMessage}</Alert>;
};

export default AlertBox;
