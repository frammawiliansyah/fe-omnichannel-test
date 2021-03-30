import React from "react";
import { Navbar, Row, Col, Form, FormGroup, Input } from "reactstrap";

// Icons
import { FaBars } from "react-icons/fa";

import { connect } from "react-redux";
import { Avatar, Space } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
    this.toogle = this.toogle.bind(this);
  }

  toogle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange(key, value) {
    this.props.setStateMasterData({ [key]: value });
    window.location.reload(true);
  }

  render() {
    return (
      <div>
        <Navbar expand="md" className="navbar py-3 m-0">
          <Row style={{ width: "120%" }}>
            {/* <Col md="3">
              <div hidden>
                <FaBars onClick={this.props.handleClick} size="24px" />
              </div>
            </Col> */}
            <Col md="12" className="text-right">
              <Space size={24}>
                <Input type="select">
                  <option value={1}>WhatsApp</option>
                </Input>
                <Avatar size={40}>
                  <b>
                    {this.props.user.account
                      ? this.props.user.account.split("")[0]
                      : null}
                  </b>
                </Avatar>
                <Avatar
                  size={40}
                  style={{
                    background: "red",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  <AiOutlineLogout
                    size={23}
                    onClick={() => {
                      localStorage.clear();
                      window.location = "/";
                    }}
                  />
                </Avatar>
              </Space>
            </Col>
          </Row>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Header);
