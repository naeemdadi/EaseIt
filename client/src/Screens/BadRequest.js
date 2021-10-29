import { Link as RouterLink } from "react-router-dom";
import { Link, Typography } from "@material-ui/core";

export default function BadRequest() {
  return (
    <Typography variant="h5" align="center">
      You hit 404. Go to{" "}
      <Link
        component={RouterLink}
        to="/"
        style={{ textDecoration: "underline", color: "red" }}
      >
        Home
      </Link>
    </Typography>
  );
}
