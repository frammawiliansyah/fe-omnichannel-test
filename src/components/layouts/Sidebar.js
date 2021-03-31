import React, { Component } from "react";
// images
import logo from "../../assets/images/logo.svg";
import { connect } from "react-redux";

class SidebarConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSidebar: this.props.activeSidebar
    };
  }

  handleClick() {
    this.setState({
      activeSidebar: !this.state.activeSidebar
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setState({
        activeSidebar: this.props.activeSidebar
      });
    }
  }

  render() {
    return (
      <div
        id="sidebar"
        className={!this.state.activeSidebar ? "sidebar active" : "sidebar"}
      >
        <div className="brand">
          <img src={logo} alt="" className="img-fluid" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.role
  };
}

export const Sidebar = connect(mapStateToProps)(SidebarConnect);

export default Sidebar;
