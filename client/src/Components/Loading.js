import { CircularProgress } from "@material-ui/core";
import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
}
