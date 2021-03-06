import React, { lazy, Suspense } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";
import AlertBox from "./AlertBox";
import Layout from "./Layout";
import Loading from "./Loading";

const SelectFirm = lazy(() => import("../Screens/SelectFirm.js"));

const PrivateRoute = ({ component: Component, restrict, ...rest }) => {
  const { auth } = useAuth();
  const { org } = useOrg();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth && org) {
          if (restrict?.includes(auth.role)) {
            return (
              <Layout>
                <AlertBox
                  errorMessage="Sorry, You Are not authorized!"
                  severity="error"
                />
              </Layout>
            );
          } else {
            return (
              <Layout>
                <Component {...props}></Component>
              </Layout>
            );
          }
        }
        if (auth && !org) {
          return (
            <Suspense fallback={<Loading />}>
              <SelectFirm {...props} />
            </Suspense>
          );
        }
        if (!auth) return <Redirect to="/signin" />;
      }}
    />
  );
};

export default PrivateRoute;
