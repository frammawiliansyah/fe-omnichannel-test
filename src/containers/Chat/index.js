import React, { Component } from "react";
import {
  CardBody,
  Card,
  Input,
  CardFooter,
  Button,
  Spinner,
  Row,
  Col,
  Badge
} from "reactstrap";
import { FiSend } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

// images
import { Avatar, Image } from "antd";
import "./style.scss";
import { connect } from "react-redux";
import moment from "moment";
import { setMessage } from "../../redux/action/message_action";
import ChatDetail from "./components/ChatDetail";
import Navbar from "../../components/layouts/Navbar";
import Bg1 from "../../assets/images/web-chat.svg";
import Bg2 from "../../assets/images/web-chat-dark.svg";
import { AiOutlinePaperClip } from "react-icons/ai";

class ChatMenu extends Component {
  state = {
    message: "",
    image: null,
    loan_id: null,
    isScrollTop: false,
    isHiddenBtnScroll: true,
    scrollPosition: 999999999
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
  onScrollChange() {
    let scrollPosition = document.getElementById("chat").scrollTop;
    let scrollHeight = document.getElementById("chat").scrollHeight;
    if (scrollHeight - scrollPosition > 1000 && this.state.isHiddenBtnScroll) {
      this.setState({ isHiddenBtnScroll: false });
    }
    if (scrollHeight - scrollPosition < 1000 && !this.state.isHiddenBtnScroll) {
      this.setState({ isHiddenBtnScroll: true });
    }
    if (scrollPosition === 0 && this.props.message_list.length < 15) {
      this.setState({ isScrollTop: true });
      setTimeout(async () => {
        await this.handleChange({
          message_list: [
            {
              loan_id: 1,
              username: "Adele",
              date: "2020-06-20 08:03",
              message: "Lorem ipsum dolor sit amet",
              is_image: false,
              is_deletable: false
            },
            ...this.props.message_list
          ]
        });
        this.setScroll(
          document.getElementById("chat").scrollHeight - scrollHeight
        );
      }, 500);
    } else {
      this.setState({ isScrollTop: false });
    }
  }
  handleMessage = message => {
    let arr = message.split(/(https?:\/\/[^\s]+)/g);
    for (let i = 1; i < arr.length; i += 2) {
      arr[i] = (
        <a key={"link" + i} href={arr[i]}>
          {arr[i]}
        </a>
      );
    }
    return arr;
  };
  onDeleteMessage = index => {
    let new_message_list = this.props.message_list;
    new_message_list[index].is_deletable = true;
    this.handleChange({
      message_list: [...new_message_list]
    });
  };
  async onSubmitMessage() {
    await this.handleChange({
      message_list: [
        ...this.props.message_list,
        {
          loan_id: 2,
          username: this.props.username,
          date: moment().format("YYYY-MM-DD hh:mm:ss"),
          message: this.state.image
            ? URL.createObjectURL(this.state.image)
            : this.state.message,
          is_image: this.state.image ? true : false
        }
      ]
    });
    await this.setState({ message: "", image: null });
    this.setScroll(999999999);
  }
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
                  <ul id="chat" onScroll={() => this.onScrollChange()}>
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
                      <Badge color="secondary">
                        Memuat data... <Spinner size="sm" color="white" />
                      </Badge>
                    </div>
                    {this.props.message_list.map((item, index) => {
                      if (item.loan_id !== 2) {
                        return (
                          <li className="you" hidden={item.is_deletable}>
                            <div
                              className="text-center my-2"
                              hidden={
                                index > 0 &&
                                moment(
                                  this.props.message_list[index - 1].date
                                ).format("DD/MM/YYYY") ===
                                  moment(item.date).format("DD/MM/YYYY")
                              }
                            >
                              <Badge>
                                {moment(item.date).format("DD/MM/YYYY")}
                              </Badge>
                            </div>
                            <div className="d-flex justify-content-start">
                              <div
                                hidden={item.loan_id === 2}
                                style={{
                                  visibility:
                                    index > 0 &&
                                    this.props.message_list[index - 1]
                                      .loan_id === item.loan_id
                                      ? "hidden"
                                      : "visible"
                                }}
                                className="mr-2"
                              >
                                <Avatar size={50}>
                                  <b>{item.username.split("")[0]}</b>
                                </Avatar>
                              </div>
                              <div className="message-box">
                                <div className="message">
                                  {item.is_image ? (
                                    <Image
                                      src={item.message}
                                      alt="document"
                                      width="150px"
                                    />
                                  ) : (
                                    this.handleMessage(item.message)
                                  )}
                                </div>
                                <div className="d-flex align-items-center justify-content-end message-footer text-muted text-right pt-2 pr-2">
                                  <div>{moment(item.date).format("hh:mm")}</div>
                                  <div className="ml-2 message-delete">
                                    <MdDelete
                                      size="18"
                                      className="cp"
                                      onClick={() =>
                                        this.onDeleteMessage(index)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      } else {
                        return (
                          <li className="me" hidden={item.is_deletable}>
                            <div
                              className="text-center my-2"
                              hidden={
                                index > 0 &&
                                moment(
                                  this.props.message_list[index - 1].date
                                ).format("DD/MM/YYYY") ===
                                  moment(item.date).format("DD/MM/YYYY")
                              }
                            >
                              <Badge>
                                {moment(item.date).format("DD/MM/YYYY")}
                              </Badge>
                            </div>
                            <div className="d-flex justify-content-end">
                              <div className="message-box">
                                <div className="message">
                                  {item.is_image ? (
                                    <Image
                                      src={item.message}
                                      alt="document"
                                      width="150px"
                                    />
                                  ) : (
                                    this.handleMessage(item.message)
                                  )}
                                </div>
                                <div className="d-flex align-items-center justify-content-end message-footer text-muted text-right pt-2 pr-2">
                                  <div>{moment(item.date).format("hh:mm")}</div>
                                  <div className="ml-2 message-delete">
                                    <MdDelete
                                      size="18"
                                      className="cp"
                                      onClick={() =>
                                        this.onDeleteMessage(index)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                hidden={item.loan_id !== 2}
                                style={{
                                  visibility:
                                    index > 0 &&
                                    this.props.message_list[index - 1]
                                      .loan_id === item.loan_id
                                      ? "hidden"
                                      : "visible"
                                }}
                                className="ml-2"
                              >
                                <Avatar size={50}>
                                  <b>{this.props.username.split("")[0]}</b>
                                </Avatar>
                              </div>
                            </div>
                          </li>
                        );
                      }
                    })}
                    <div
                      className="text-center"
                      style={{
                        position: "sticky",
                        bottom: "0px"
                      }}
                      hidden={this.state.isHiddenBtnScroll}
                    >
                      <Badge
                        onClick={() => this.setScroll(999999999)}
                        color="info"
                        className="cp"
                      >
                        Scroll Down
                      </Badge>
                    </div>
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
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        overflow: "hidden"
                      }}
                      className="p-0 m-0 d-flex justify-content-center mr-2"
                    >
                      <label className="cp w-100 h-100 d-flex justify-content-center align-items-center">
                        <div>
                          <AiOutlinePaperClip size="20" />
                        </div>
                        <Input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={async e => {
                            if (e.target.value) {
                              this.setState({
                                message: "",
                                image: e.target.files[0]
                              });
                            }
                          }}
                        />
                      </label>
                    </Button>
                  </div>
                  <Input
                    disabled={this.state.image !== null}
                    placeholder="Type a message here..."
                    type="textarea"
                    className="m-0 custom-input-theme"
                    autoFocus
                    value={
                      this.state.image
                        ? this.state.image.name
                        : this.state.message
                    }
                    style={this.setInputHeight()}
                    onChange={e => this.setState({ message: e.target.value })}
                  />
                  <Button
                    hidden={this.state.image === null}
                    className="ml-2"
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px"
                    }}
                    color="danger"
                    onClick={() => this.setState({ image: null })}
                  >
                    <MdDelete />
                  </Button>
                  <Button
                    hidden={
                      this.state.image === null && this.state.message === ""
                    }
                    className="ml-2"
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px"
                    }}
                    color="primary"
                    onClick={() => this.onSubmitMessage()}
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
