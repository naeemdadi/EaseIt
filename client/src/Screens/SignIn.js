import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CircularProgress, Link } from "@material-ui/core";
import { useHistory } from "react-router";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: "pointer",
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const { setAuth } = useAuth();
  const { setOrg } = useOrg();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [isEmailError, setIsEmailError] = useState(false);
  const [requiredError, setRequiredError] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const signInHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userData.password) {
      setRequiredError(true);
      setLoading(false);
    } else if (!validateEmail(userData.email)) {
      setIsEmailError(true);
      setLoading(false);
    } else {
      try {
        const { data } = await axios.post("/api/users/login", userData);
        setAuth(data.user);
        setAuth((prev) => {
          localStorage.setItem("userInfo", JSON.stringify(prev));
          return prev;
        });
        if (data.company) {
          setOrg(data.company);
          setOrg((prev) => {
            localStorage.setItem("orgInfo", JSON.stringify(prev));
            return prev;
          });
          setLoading(false);
        }
        history.push("/");
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    }
  };

  const guestSignIn = async (desi) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/users/guestLogin", { desi });
      setAuth(data.user);
      setAuth((prev) => {
        localStorage.setItem("userInfo", JSON.stringify(prev));
        return prev;
      });
      if (data.company) {
        setOrg(data.company);
        setOrg((prev) => {
          localStorage.setItem("orgInfo", JSON.stringify(prev));
          return prev;
        });
      }
      setLoading(false);
      history.push("/");
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
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
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={signInHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={onChangeHandler("email")}
            error={isEmailError}
            helperText={isEmailError ? "Please add valid Email Address" : null}
            onFocus={() => setIsEmailError(false)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={onChangeHandler("password")}
            error={requiredError}
            helperText={requiredError ? "Password field is required" : null}
            onFocus={() => setRequiredError(false)}
          />
          {error && <AlertBox errorMessage={error} severity="error" />}
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
              "Sign In"
            )}
          </Button>

          <Grid container>
            <Grid item>
              <Link
                variant="body2"
                onClick={() => history.push("/signup")}
                className={classes.link}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Typography
          component="h2"
          variant="h5"
          align="center"
          style={{ marginTop: "20px" }}
        >
          Guest User Sign In
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          style={{ marginTop: "10px" }}
          onClick={() => guestSignIn("superAdmin")}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Sign In as Super Admin"
          )}
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          style={{ marginTop: "10px" }}
          onClick={() => guestSignIn("admin")}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Sign In as Admin"
          )}
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          style={{ marginTop: "10px" }}
          onClick={() => guestSignIn("employee")}
        >
          {loading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Sign In as Employee"
          )}
        </Button>
        <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
          Note: For full testing of the app sign in as all the three Roles
          provided using different incognito windows.
        </Typography>
      </div>
    </Container>
  );
}
