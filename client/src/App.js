import { createTheme, ThemeProvider } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import PrivateRoute from "./Components/PrivateRoute";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import UserProfile from "./Screens/UserProfile";
import BadRequest from "./Screens/BadRequest";
import Messages from "./Screens/messages/Messages";
import Tasks from "./Screens/Tasks";
import { useAuth } from "./Contexts/AuthContext";
import Loading from "./Components/Loading";

const Employees = lazy(() => import("./Screens/Employees.js"));
const NewTask = lazy(() => import("./Screens/NewTask.js"));

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
  const { auth } = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/signin" exact render={() => <SignIn />} />
        <Route path="/signup" exact render={() => <SignUp />} />
        <Layout>
          <PrivateRoute path="/" exact component={Tasks} />
          <PrivateRoute path="/profile" exact component={UserProfile} />
          {auth?.role === "superAdmin" && (
            <Suspense fallback={<Loading loading={true} />}>
              <PrivateRoute
                path="/employees"
                restrict={["employee", "admin"]}
                exact
                component={Employees}
              />
            </Suspense>
          )}
          {(auth?.role === "admin" || auth?.role === "superAdmin") && (
            <Suspense fallback={<Loading loading={true} />}>
              <PrivateRoute
                path="/newtask"
                exact
                restrict={["employee"]}
                component={NewTask}
              />
            </Suspense>
          )}
          <PrivateRoute path="/taskmessages" exact component={Messages} />
        </Layout>
        <Route component={BadRequest} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
