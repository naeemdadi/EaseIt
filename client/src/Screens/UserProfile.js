import { Avatar, Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    alignItems: "center",
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const UserProfile = () => {
  const { auth } = useAuth();
  const { org } = useOrg();
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      {auth.profilePic ? (
        <Avatar
          className={classes.large}
          alt={auth.name}
          src={auth?.profilePic}
        />
      ) : (
        <Avatar className={classes.large}>{auth.name.split(" ")[0][0]}</Avatar>
      )}
      <div>
        <Typography variant="h6" component="h2" color="textPrimary">
          {auth.name}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            {auth.designation} at {org.companyName}
          </Typography>
          {/* <Typography variant="body1" color="textSecondary">
            {` ${org.companyName}`}
          </Typography> */}
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
