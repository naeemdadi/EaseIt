import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Tooltip,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
} from "@material-ui/core";
import { ExitToApp, Menu as MenuIcon } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";
import clsx from "clsx";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
}));

export default function MenuBar({ handleDrawerOpen, open }) {
  const classes = useStyles();
  const history = useHistory();
  const { auth, setAuth } = useAuth();
  const { setOrg, org } = useOrg();

  const signOutHandler = () => {
    setAuth(null);
    setOrg(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("orgInfo");
    history.push("/signin");
  };

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, open && org && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          style={{ cursor: "pointer" }}
          className={classes.title}
          onClick={() => history.push("/")}
        >
          EaseIt
        </Typography>
        {org && (
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {org.companyName}
          </Typography>
        )}
        {auth && (
          <Tooltip title="Signout">
            <IconButton
              aria-label="signout"
              color="inherit"
              onClick={signOutHandler}
            >
              <ExitToApp fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
