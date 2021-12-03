import { createTheme, ThemeProvider } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import UserProfile from "./Screens/UserProfile";
import BadRequest from "./Screens/BadRequest";
import Messages from "./Screens/messages/Messages";
import Tasks from "./Screens/Tasks";
import Employees from "./Screens/Employees";
import NewTask from "./Screens/NewTask";

const theme = createTheme({
  palette: {
    secondary: purple,
  },
  typography: {
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <PrivateRoute path="/" exact component={Tasks} />
        <PrivateRoute path="/profile" exact component={UserProfile} />
        <PrivateRoute
          path="/employees"
          restrict={["employee", "admin"]}
          exact
          component={Employees}
        />
        <PrivateRoute
          path="/newtask"
          exact
          restrict={["employee"]}
          component={NewTask}
        />
        <PrivateRoute path="/taskmessages" exact component={Messages} />
        <Route component={BadRequest} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
