import React from "react";
import { Navbar, Row, Col, Input, Button } from "reactstrap";

import { connect } from "react-redux";
import { Avatar, Space } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import { setStateUser } from "../../redux/action/user_action";
import { FiMoon, FiSun } from "react-icons/fi";

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

  switchTheme() {
    const body = document.body;
    const lightTheme = "light";
    const darkTheme = "dark";
    let theme = this.props.user.theme;
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      theme = darkTheme;
    }
    this.props.setStateUser({
      theme
    });
  }

  render() {
    return (
      <div>
        <Navbar expand="md" className="navbar py-3 m-0">
          <Row style={{ width: "120%" }}>
            <Col md="12" className="text-right">
              <Space size={24}>
                <Button
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    background:
                      this.props.user.theme !== "dark" ? "#5a6268" : "#ffc107"
                  }}
                  color={
                    this.props.user.theme !== "dark" ? "#5a6268" : "warning"
                  }
                  onClick={() => this.switchTheme()}
                >
                  {this.props.user.theme !== "dark" ? (
                    <FiMoon className="text-white" />
                  ) : (
                    <FiSun className="text-white" />
                  )}
                </Button>
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

export default connect(mapStateToProps, { setStateUser })(Header);
