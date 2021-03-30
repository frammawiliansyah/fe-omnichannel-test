import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Spinner } from "reactstrap";

// layout
import ScrollTop from "./ScrollTop";
import {
  MainLayout,
  LayoutRoute,
  EmptyLayout,
  AuthenticatedLayoutRoute
} from "../components/layouts";

import { connect } from "react-redux";
import { storage } from "../redux/local_storage";

// containers
const Auth = lazy(() => import("../containers/Auth"));
// const Dashboard = lazy(() => import("../containers/Dashboard"));
const Chat = lazy(() => import("../containers/Chat"));
class AppConnect extends Component {
  checkAuthentication() {
    const store = storage.get(process.env.REACT_APP_LOCAL_STORAGE_NAME);
    if (store) return true;
    return false;
  }

  checkAuthorization(spesificGrantedRoles) {
    let result = false;

    if (spesificGrantedRoles) {
      spesificGrantedRoles.map(role => {
        if (role === this.props.role) {
          result = true;
        }
      });
    } else {
      result = true;
    }
    return result;
  }

  render() {
    return (
      <div>
        <Router>
          <Suspense
            fallback={
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              >
                <Spinner type="grow" color="white" />
              </div>
            }
          >
            <ScrollTop>
              <Switch>
                <LayoutRoute
                  exact
                  path="/"
                  layout={EmptyLayout}
                  component={Auth}
                />
                <AuthenticatedLayoutRoute
                  exact
                  path="/chat"
                  layout={MainLayout}
                  component={Chat}
                  authentication={this.checkAuthentication()}
                  authorization={this.checkAuthorization([
                    "ARO",
                    "COLLECTION_LEAD",
                    "COLLECTION_MANAGER"
                  ])}
                />
              </Switch>
            </ScrollTop>
          </Suspense>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.role
  };
}

export const App = connect(mapStateToProps)(AppConnect);

export default App;
