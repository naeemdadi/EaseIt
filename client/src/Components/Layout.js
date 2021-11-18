import React, { useState } from "react";
import { makeStyles, CssBaseline } from "@material-ui/core";
import MenuBar from "./MenuBar";
import DrawerBar from "./DrawerBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  page: {
    background: "#f9f9f9",
    width: "100%",
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Layout(props) {
  const classes = useStyles();

  const { children } = props;
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* app bar */}
      <MenuBar open={open} handleDrawerOpen={handleDrawerOpen} />

      {/* Drawer */}
      <DrawerBar open={open} handleDrawerClose={handleDrawerClose} />

      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  );
}
