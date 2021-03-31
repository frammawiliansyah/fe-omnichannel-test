import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticatedLayoutRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      rest.authentication ? (
        rest.authorization ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

export default AuthenticatedLayoutRoute;
