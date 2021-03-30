import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import { checkToken } from "../../function/storage_function";

// const access_is_valid =

const PrivateLayoutRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      checkToken() ? (
        <Layout>
          <Component {...props} />
        </Layout>
      ) : (
        <Redirect
          to={{ pathname: "/forbidden", state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateLayoutRoute;
