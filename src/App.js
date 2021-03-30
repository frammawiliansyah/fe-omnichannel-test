import React, { Component } from "react";
import Router from "./router/Router";
import CustomModal from "./components/layouts/CustomModal";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router />
        <CustomModal />
      </div>
    );
  }
}

export default App;
