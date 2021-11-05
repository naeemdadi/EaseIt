import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import {
  AccountCircleRounded,
  AddCircleOutlineOutlined,
  ChevronLeft,
  HomeOutlined,
  PeopleOutlineOutlined,
} from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  active: {
    background: "#f4f4f4",
  },
}));

const DrawerBar = ({ open, handleDrawerClose }) => {
  const { auth } = useAuth();
  const { org } = useOrg();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const mainListItems = () => {
    if (auth.role === "superAdmin") {
      return [
        {
          text: "Home",
          icon: <HomeOutlined color="secondary" />,
          path: "/",
        },
        {
          text: "Add New Task",
          icon: <AddCircleOutlineOutlined color="secondary" />,
          path: "/newtask",
        },
        {
          text: "Employees",
          icon: <PeopleOutlineOutlined color="secondary" />,
          path: "/employees",
        },
        {
          text: "Profile",
          icon: <AccountCircleRounded color="secondary" />,
          path: "/profile",
        },
      ];
    } else if (auth.role === "admin") {
      return [
        {
          text: "Home",
          icon: <HomeOutlined color="secondary" />,
          path: "/",
        },
        {
          text: "Add New Task",
          icon: <AddCircleOutlineOutlined color="secondary" />,
          path: "/newtask",
        },
        {
          text: "Profile",
          icon: <AccountCircleRounded color="secondary" />,
          path: "/profile",
        },
      ];
    } else {
      return [
        {
          text: "Home",
          icon: <HomeOutlined color="secondary" />,
          path: "/",
        },
        {
          text: "Profile",
          icon: <AccountCircleRounded color="secondary" />,
          path: "/profile",
        },
      ];
    }
  };

  return (
    org && (
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          {mainListItems().map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => history.push(item.path)}
              className={
                location.pathname === item.path ? classes.active : null
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    )
  );
};

export default DrawerBar;
