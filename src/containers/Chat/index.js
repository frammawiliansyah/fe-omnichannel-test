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
import axios from "axios";

class ChatMenu extends Component {
  state = {
    urlSocket: "ws://localhost:3009/echo",
    webSocket: null,
    number: this.props.chat_detail.number,
    messageContent: "",
    image: null,
    loan_id: null,
    isScrollTop: false,
    isHiddenBtnScroll: true,
    scrollPosition: 999999999,
    intervalId: null
  };

  componentDidMount() {}

  componentDidUpdate() {
    const loanId = this.props.chat_detail.loan_id;
    const chatId = this.props.chat_detail.chat_id;
    const { scrollPosition, loan_id, intervalId } = this.state;

    if (loan_id !== loanId) {
      this.getData();
      this.setScroll(scrollPosition);
      this.setState({ loan_id: loanId });
    }

    console.log("chatId", chatId, intervalId);
    if (intervalId === null && chatId !== null) {
      const intervalData = setInterval(this.refreshData(chatId), 300000);
      this.setState({ intervalId: intervalData });
    }
  }

  refreshData = async chatId => {
    console.log("refreshData", new Date());
    await axios.post(
      process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/refresh",
      { chat_id: chatId }
    );
  }

  setScroll(numb) {
    document.getElementById("chat").scrollTop = numb;
  }

  setInputHeight() {
    let { messageContent } = this.state;
    let inputRows = messageContent.split("\n").length * 24;
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

    if (chat_detail) this.props.setMessage({ chat_detail });
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
    if (message !== undefined && message !== null) {
      let arr = message.split(/(https?:\/\/[^\s]+)/g);
      for (let i = 1; i < arr.length; i += 2) {
        arr[i] = (
          <a key={"link" + i} href={arr[i]}>
            {arr[i]}
          </a>
        );
      }
      return arr;
    }
  };

  onDeleteMessage = index => {
    let new_message_list = this.props.message_list;
    new_message_list[index].is_deletable = true;
    this.handleChange({
      message_list: [...new_message_list]
    });
  };

  async onSubmitMessage() {
    const { contact_id, chat_id, number } = this.props.chat_detail;
    const { messageContent, scrollPosition } = this.state;

    const payloadData = {
      contact_id,
      chat_id,
      admin_user_id: this.props.user.id,
      mobile_number: Number(number),
      message_content: messageContent,
      message_status: 'SEND'
    }

    await axios.post(
      process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/send",
      { ...payloadData },
      {
        validateStatus: function() {
          return true;
        }
      }
    );

    await this.handleChange({
      message_list: [
        ...this.props.message_list,
        {
          id: null,
          contactId: payloadData.contact_id,
          chatId: payloadData.chat_id,
          adminUserId: payloadData.admin_user_id,
          messageContent,
          messageStatus: payloadData.message_status,
          messageDate: null,
          processedAt: null,
          createdAt: null,
          messageType: 'MESSAGE-OUT',
        }
      ]
    });

    this.setState({ messageContent: "", image: null });
    this.setScroll(scrollPosition);
  }

  render() {
    const { message_list } = this.props;
    const { scrollPosition } = this.state;
    
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
                    {message_list.map((item, index) => {
                      if (item.adminUserId === undefined) {
                        let content = JSON.parse(item.messageContent);
                        console.log(content);
                        return (
                          <li className="you" hidden={item.is_deletable}>
                            { item.messageDate === null ? null : (
                              <div
                                className="text-center my-2"
                                hidden={
                                  index > 0 &&
                                  moment(
                                    message_list[index - 1].date
                                  ).format("DD/MM/YYYY") ===
                                    moment(item.messageDate).format("DD/MM/YYYY")
                                }
                              >
                                <Badge>
                                  {moment(item.messageDate).format("DD/MM/YYYY")}
                                </Badge>
                              </div>
                            )}
                            <div className="d-flex justify-content-start">
                              <div className="message-box">
                                <div className="message">
                                  {content.is_image === 'true' ? (
                                    <Image
                                      src={item.message}
                                      alt="document"
                                      width="150px"
                                    />
                                  ) : (
                                    this.handleMessage(content.text)
                                  )}
                                </div>
                                <div className="d-flex align-items-center justify-content-end message-footer text-muted text-right pt-2 pr-2">
                                  { item.messageDate === null ? (
                                    <div>On Progress ...</div>
                                  ) : (
                                    <div>{moment(item.messageDate).format("hh:mm")}</div>
                                  ) }
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
                        console.log("item.messageContent", item.messageContent);
                        return (
                          <li className="me" hidden={item.is_deletable}>
                            { item.messageDate === null ? null : (
                              <div
                                className="text-center my-2"
                                hidden={
                                  index > 0 &&
                                  moment(
                                    message_list[index - 1].date
                                  ).format("DD/MM/YYYY") ===
                                    moment(item.messageDate).format("DD/MM/YYYY")
                                }
                              >
                                <Badge>
                                  {moment(item.messageDate).format("DD/MM/YYYY")}
                                </Badge>
                              </div>
                            )}
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
                                    this.handleMessage(item.messageContent)
                                  )}
                                </div>
                                <div className="d-flex align-items-center justify-content-end message-footer text-muted text-right pt-2 pr-2">
                                  { item.messageDate === null ? (
                                    <div>On Progress ...</div>
                                  ) : (
                                    <div>{moment(item.messageDate).format("hh:mm")}</div>
                                  )}
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
                                    message_list[index - 1]
                                      .loan_id === item.loan_id
                                      ? "hidden"
                                      : "visible"
                                }}
                                className="ml-2"
                              >
                                <Avatar size={50}>
                                  <b>{this.props.number}</b>
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
                        onClick={() => this.setScroll(scrollPosition)}
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
                        : this.state.messageContent
                    }
                    style={this.setInputHeight()}
                    onChange={e => this.setState({ messageContent: e.target.value })}
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
                      this.state.image === null && this.state.messageContent === ""
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
    theme: state.user.theme,
    user: state.user.account,
  };
};

export default connect(mapStateToProps, {
  setMessage
})(ChatMenu);
