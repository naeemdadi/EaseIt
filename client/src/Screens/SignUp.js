import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import AlertBox from "../Components/AlertBox";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: "pointer",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    // profileImg: "",
    designation: "",
  });
  const [company, setCompany] = useState({
    companyName: "",
    companyUniqueId: "",
    joiningPassword: "",
  });
  const [isEmailError, setIsEmailError] = useState(false);
  const [requiredError, setRequiredError] = useState(false);
  const [role, setRole] = useState("employee");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRole = (event, newRole) => {
    setRole(newRole);
  };

  // const handlePhoto = (e) => {
  //   setUserData({ ...userData, profileImg: e.target.files[0] });
  // };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onChangeHandler = (input) => (e) => {
    setUserData({
      ...userData,
      [input]: e.target.value,
    });
  };

  const onChangeCompanyData = (input) => (e) => {
    setCompany({
      ...company,
      [input]: e.target.value,
    });
  };

  const userSignUp = async (e) => {
    e.preventDefault();

    if (
      role === "superAdmin"
        ? !userData.name ||
          !userData.password ||
          !userData.designation ||
          !company.companyName ||
          !company.companyUniqueId ||
          !company.joiningPassword
        : !userData.name || !userData.password || !userData.designation
    ) {
      setRequiredError(true);
      setLoading(false);
      return;
    }
    if (!validateEmail(userData.email)) {
      setIsEmailError(true);
      setLoading(false);
      return;
    }
    try {
      if (role === "superAdmin") {
        const { data } = await axios.post("/api/users/registerSuperAdmin", {
          userData,
          company,
          role,
        });
        alert(data?.message);
        setLoading(false);
      } else {
        const { data } = await axios.post(
          "/api/users/registerEmployee",
          userData
        );
        alert(data?.message);
        setLoading(false);
      }
      history.push("/signin");
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && <AlertBox errorMessage={error} severity="error" />}
        <form
          className={classes.form}
          noValidate
          onSubmit={userSignUp}
          encType="multipart/form-data"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRole}
                size="small"
              >
                <ToggleButton value="superAdmin" aria-label="superAdmin">
                  <Typography variant="h6" size="small">
                    Super Admin
                  </Typography>
                </ToggleButton>
                <ToggleButton value="employee" aria-label="employee">
                  <Typography variant="h6">Employee</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {role === "superAdmin" ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="companyName"
                    onChange={onChangeCompanyData("companyName")}
                    error={requiredError && company.companyName.length === 0}
                    onFocus={() => setRequiredError(false)}
                    helperText={
                      requiredError && !company.companyName
                        ? "Company Name is Required"
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="companyUniqueId"
                    label="Company Unique Id"
                    name="companyUniqueId"
                    onChange={onChangeCompanyData("companyUniqueId")}
                    error={
                      requiredError && company.companyUniqueId.length === 0
                    }
                    onFocus={() => setRequiredError(false)}
                    helperText={
                      requiredError && !company.companyUniqueId
                        ? "Company Unique Id is Required"
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    id="joiningPassword"
                    label="Joining password for employees"
                    name="joiningPassword"
                    onChange={onChangeCompanyData("joiningPassword")}
                    error={
                      requiredError && company.joiningPassword.length === 0
                    }
                    onFocus={() => setRequiredError(false)}
                    helperText={
                      requiredError && !company.joiningPassword
                        ? "Joining password is Required"
                        : null
                    }
                  />
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id={role === "superAdmin" ? "superAdminName" : "Name"}
                label={role === "superAdmin" ? "Super Admin Name" : "Name"}
                name={role === "superAdmin" ? "superAdminName" : "Name"}
                onChange={onChangeHandler("name")}
                error={requiredError && userData.name.length === 0}
                onFocus={() => setRequiredError(false)}
                helperText={
                  requiredError && !userData.name ? "Name is Required" : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="designation"
                label="Designation"
                name="designation"
                onChange={onChangeHandler("designation")}
                error={requiredError && userData.designation.length === 0}
                onFocus={() => setRequiredError(false)}
                helperText={
                  requiredError && !userData.designation
                    ? "Designation is Required"
                    : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChangeHandler("email")}
                error={isEmailError}
                helperText={
                  isEmailError ? "Please add valid Email Address" : null
                }
                onFocus={() => setIsEmailError(false)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChangeHandler("password")}
                error={requiredError && userData.password.length === 0}
                helperText={requiredError ? "Password field is required" : null}
                onFocus={() => setRequiredError(false)}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <label
                htmlFor="profilePic"
                style={{ display: "block", paddingBottom: "6px" }}
              >
                Choose Profile Picture
              </label>
              <input
                type="file"
                filename="profilePic"
                name="profilePic"
                accpt="image/*"
                onChange={handlePhoto}
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Sign Up"
            )}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                variant="body2"
                className={classes.link}
                onClick={() => history.push("/signin")}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
