import React, { Component } from "react";
import {
  CardBody,
  Card,
  Input,
  CardFooter,
  Button,
  Spinner,
  Row,
  Col
} from "reactstrap";
import { FiSend } from "react-icons/fi";

// images
import { Avatar, Space } from "antd";
import "./style.scss";
import { connect } from "react-redux";
import moment from "moment";
import { setMessage } from "../../redux/action/message_action";
import ChatDetail from "./components/ChatDetail";
import Navbar from "../../components/layouts/Navbar";
import Bg1 from "../../assets/images/web-chat.svg";
import Bg2 from "../../assets/images/web-chat-dark.svg";

class ChatMenu extends Component {
  state = {
    scrollPosition: 999999999,
    message: "",
    loan_id: null,
    isScrollTop: false
  };
  componentDidUpdate() {
    let loan_id = this.props.chat_detail.loan_id;
    if (this.state.loan_id !== loan_id) {
      this.getData();
      document.getElementById("chat").scrollTop = 999999999;
      this.setState({ loan_id });
    }
  }
  setScroll(numb) {
    document.getElementById("chat").scrollTop = numb;
  }
  setInputHeight() {
    let { message } = this.state;
    let inputRows = message.split("\n").length * 24;
    let inputHeight = inputRows + 20 + "px";
    if (inputRows > 216) {
      return {
        height: "236px",
        padding: "10px",
        overflow: "auto",
        resize: "none",
        borderRadius: "1rem"
      };
    }
    return {
      height: inputHeight,
      padding: "10px",
      overflow: "hidden",
      resize: "none",
      borderRadius: "1rem"
    };
  }
  getData() {
    const loan_id = this.props.chat_detail.loan_id;
    let chat_detail = this.props.chat_detail;
    chat_detail = this.props.chat_list.filter(
      item => item.loan_id === loan_id
    )[0];
    if (chat_detail) {
      this.props.setMessage({ chat_detail });
    }
  }
  handleChange = value => {
    this.props.setMessage(value);
  };
  render() {
    return (
      <div>
        <div hidden={this.props.chat_detail.loan_id !== null}>
          <Navbar />
          <br />
          <Card>
            <CardBody className="text-center">
              <img
                src={this.props.theme === "dark" ? Bg2 : Bg1}
                width="84%"
                className="m-auto"
                alt="bg-dashboard"
              />
            </CardBody>
          </Card>
        </div>
        <Row hidden={this.props.chat_detail.loan_id === null}>
          <Col sm={8}>
            <Card>
              <CardBody>
                <div className="text-center p-2">
                  <b>{this.props.chat_detail.username}</b>
                </div>
                <hr />
                <div style={{ height: "75vh" }}>
                  <ul
                    id="chat"
                    onScroll={() => {
                      let scrollPosition = document.getElementById("chat")
                        .scrollTop;
                      let scrollHeight = document.getElementById("chat")
                        .scrollHeight;
                      if (
                        scrollPosition === 0 &&
                        this.props.message_list.length < 15
                      ) {
                        this.setState({ isScrollTop: true });
                        setTimeout(async () => {
                          await this.handleChange({
                            message_list: [
                              {
                                loan_id: 1,
                                username: "Adele",
                                date: "2020-06-20 08:03",
                                message: "Lorem ipsum dolor sit amet"
                              },
                              ...this.props.message_list
                            ]
                          });
                          this.setScroll(
                            document.getElementById("chat").scrollHeight -
                              scrollHeight
                          );
                        }, 500);
                      } else {
                        this.setState({ isScrollTop: false });
                      }
                    }}
                  >
                    <div
                      className="text-center p-2"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                      hidden={!this.props.load_message}
                    >
                      Memuat data... <Spinner size="sm" color="primary" />
                    </div>
                    <div
                      className="text-center"
                      hidden={
                        this.props.load_message ||
                        (!this.props.load_message && !this.state.isScrollTop)
                      }
                    >
                      <Button color="secondary">
                        Memuat data... <Spinner size="sm" color="white" />
                      </Button>
                    </div>
                    {this.props.message_list.map((item, index) => {
                      return (
                        <li className={item.loan_id !== 2 ? "you" : "me"}>
                          <Space>
                            <div
                              hidden={item.loan_id === 2}
                              style={{
                                visibility:
                                  index > 0 &&
                                  this.props.message_list[index - 1].loan_id ===
                                    item.loan_id
                                    ? "hidden"
                                    : "visible"
                              }}
                            >
                              <Avatar size={50}>
                                <b>{item.username.split("")[0]}</b>
                              </Avatar>
                            </div>
                            <div>
                              <div className="entete">
                                <span
                                  className={
                                    item.loan_id !== 2
                                      ? "status green mr-2"
                                      : "status blue mr-2"
                                  }
                                ></span>
                                <h3>
                                  {moment(item.date).format(
                                    "DD-MM-YYYY, h:mm:ss a"
                                  )}
                                </h3>
                              </div>
                              <div>
                                <div className="message">{item.message}</div>
                              </div>
                            </div>
                            <div
                              hidden={item.loan_id !== 2}
                              style={{
                                visibility:
                                  index > 0 &&
                                  this.props.message_list[index - 1].loan_id ===
                                    item.loan_id
                                    ? "hidden"
                                    : "visible"
                              }}
                            >
                              <Avatar size={50}>
                                <b>{this.props.username.split("")[0]}</b>
                              </Avatar>
                            </div>
                          </Space>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardBody>
              <CardFooter
                className="py-4"
                style={{
                  background: "#fff",
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem"
                }}
              >
                <div className="d-flex align-items-stretch">
                  <Input
                    placeholder="Type a message here..."
                    type="textarea"
                    className="m-0 mr-3 custom-input-theme"
                    autoFocus
                    value={this.state.message}
                    style={this.setInputHeight()}
                    onChange={e => this.setState({ message: e.target.value })}
                  />
                  <Button
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px"
                    }}
                    color="primary"
                    onClick={async () => {
                      if (this.state.message !== "") {
                        await this.handleChange({
                          message_list: [
                            ...this.props.message_list,
                            {
                              loan_id: 2,
                              username: this.props.username,
                              date: moment().format("YYYY-MM-DD hh:mm:ss"),
                              message: this.state.message
                            }
                          ]
                        });
                        await this.setState({ message: "" });
                        this.setScroll(999999999);
                      }
                    }}
                  >
                    <FiSend />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col sm={4} className="p-0">
            <div>
              <Navbar />
              <hr />
              <ChatDetail />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    message_list: state.message.message_list,
    chat_list: state.message.chat_list,
    chat_detail: state.message.chat_detail,
    username: state.user.account,
    load_message: state.message.load_message,
    theme: state.user.theme
  };
};
export default connect(mapStateToProps, {
  setMessage
})(ChatMenu);
