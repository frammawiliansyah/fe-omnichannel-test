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
    number: this.props.chat_detail.number,
    messageContent: "",
    image: null,
    loan_id: null,
    isScrollTop: false,
    isHiddenBtnScroll: true,
    scrollPosition: 999999999,
    imageUrl: {}
  };

  componentDidMount() {}

  componentDidUpdate() {
    const propsLoanId = this.props.chat_detail.loan_id;
    const stateLoanId = this.state.loan_id;

    if (propsLoanId !== stateLoanId) {
      this.setScroll( this.state.scrollPosition );
      this.setState({
        loan_id: propsLoanId
      });
    }
  }

  setScroll = (scroolNumber) => document.getElementById("chat").scrollTop = scroolNumber;
  handleChange = (value) => this.props.setMessage(value);

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
    } else {
      return {
        height: inputHeight,
        padding: "10px",
        overflow: "hidden",
        resize: "none",
        borderRadius: "1rem"
      };
    }    
  }

  // WILL BE FIXED
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

        this.setScroll(document.getElementById("chat").scrollHeight - scrollHeight);
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

  // WILL BE DELETED
  onDeleteMessage = index => {
    let new_message_list = this.props.message_list;
    new_message_list[index].is_deletable = true;
    this.handleChange({
      message_list: [...new_message_list]
    });
  };

  onSubmitMessage = async () => {
    const { contact_id, chat_id, number } = this.props.chat_detail;
    const { messageContent, scrollPosition } = this.state;

    const sendMessage = await axios.post(
      process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/send", {
        contact_id,
        chat_id,
        admin_user_id: this.props.user.id,
        mobile_number: Number(number),
        message_content: messageContent,
        message_status: 'SEND'
      }
    );

    if (sendMessage.data.status === 'SUCCESS') {
      await this.handleChange({ message_list: this.props.message_list.concat(sendMessage.data.outgoingMessage) });
      await this.setState({ messageContent: "", image: null });
    }

    this.setScroll(scrollPosition);
  }

  getImageURL = async (image) => {
    let resultData = await new Promise((resolve, reject) => {
      axios.post(
        process.env.REACT_APP_API_STORATE_END_POINT, {
          filename: image.filename,
          folder: `whatsapp/${image.folder}`
        }
      ).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });

    let imageUrl = this.state.imageUrl;
        imageUrl[`${image.filename}`] = resultData.data.result;
    this.setState({ imageUrl });
  }

  render() {
    const { message_list, chat_detail } = this.props;
    const { scrollPosition } = this.state;
    
    return (
      <div>
        <div hidden={chat_detail.loan_id !== null}>
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
        <Row hidden={chat_detail.loan_id === null}>
          <Col sm={8}>
            <Card>
              <CardBody>
                <div className="text-center p-2">
                  <b>{chat_detail.username}</b>
                </div>
                <hr />
                <div style={{ height: "75vh" }}>
                  <ul id="chat">
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
                        if (content.is_image === 'true') {
                          let imageData = this.state.imageUrl[`${content.image.filename}`];
                          if (imageData === undefined || imageData === null) this.getImageURL(content.image);
                        }
                        return (
                          <li className="you" hidden={item.is_deletable} key={`messageList_${index}`}>
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
                                      src={this.state.imageUrl[`${content.image.filename}`]}
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
                                    <div>By {chat_detail.username} - {moment(item.messageDate).format("hh:mm")}</div>
                                  ) }
                                  { false ? (
                                    <div className="ml-2 message-delete">
                                      <MdDelete
                                        size="18"
                                        className="cp"
                                        onClick={() =>
                                          this.onDeleteMessage(index)
                                        }
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      } else {
                        return (
                          <li className="me" hidden={item.is_deletable} key={`messageList_${index}`}>
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
                                    <div>By {item.admin_user.username.toUpperCase()} - {moment(item.messageDate).format("hh:mm")}</div>
                                  )}
                                  { false ? (
                                    <div className="ml-2 message-delete">
                                      <MdDelete
                                        size="18"
                                        className="cp"
                                        onClick={() =>
                                          this.onDeleteMessage(index)
                                        }
                                      />
                                    </div>
                                  ) : null }
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
                  { false ? (
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
                  ) : null}
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
