import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

// icons
import { FiSearch } from "react-icons/fi";

// images
import logo from "../../assets/images/logo.svg";
import { connect } from "react-redux";
import {
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { Avatar, Badge, List } from "antd";

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

        {/* <div className="list-unstyled components">
          <NavLink to="/dashboard" className="sidebar-link text-muted">
            Dashboard
          </NavLink>
          <NavLink
            to="/strategi"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Strategi
          </NavLink>
          <NavLink
            to="/configuration"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Konfigurasi
          </NavLink>
          <NavLink
            to="/national-holiday"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Hari Libur Nasional
          </NavLink>
          <NavLink
            to="/assign-strategi"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Analitik
          </NavLink>
          <NavLink
            to="/monitoring"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Pemantauan
          </NavLink>
          <NavLink
            to="/loc"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            LOC
          </NavLink>
          <NavLink
            to="/skip-tracer-manager"
            className="sidebar-link text-muted"
            hidden={this.props.role !== "COLLECTION_MANAGER"}
          >
            Skip Tracer
          </NavLink>
          <NavLink
            to="/skip-tracer-leader"
            className="sidebar-link text-muted"
            hidden={this.props.role !== "COLLECTION_LEAD"}
          >
            Skip Tracer
          </NavLink>
          <NavLink
            to="/reporting"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Pelaporan
          </NavLink>
          <NavLink
            to="/aro/task"
            className="sidebar-link text-muted"
            hidden={this.props.role !== "ARO"}
          >
            Tugas
          </NavLink>
          <NavLink
            to="/aro/report"
            className="sidebar-link text-muted"
            hidden={this.props.role !== "ARO"}
          >
            Laporan
          </NavLink>
          <NavLink
            to="/robocall/files"
            className="sidebar-link text-muted"
            hidden={this.props.role === "ARO"}
          >
            Unduh Rekaman Robocall
          </NavLink>
          <NavLink
            to="/"
            onClick={() => localStorage.clear()}
            className="sidebar-link text-muted btn-logout"
          >
            <BiLogOut className="mr-2" size="22" /> Keluar
          </NavLink>
        </div> */}
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
