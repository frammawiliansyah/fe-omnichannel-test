import React, { Component } from "react";
import { CardBody, Card, Input, CardFooter, Button, Spinner } from "reactstrap";
import { FiSend } from "react-icons/fi";

// images
import { Avatar, Space, Badge } from "antd";
import "./style.scss";
// import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import moment from "moment";
import { setMessage } from "../../redux/action/message_action";

class ChatMenu extends Component {
  state = {
    scrollPosition: 999999999,
    message: ""
  };
  componentDidMount() {
    this.setScroll(this.state.scrollPosition);
    this.getData();
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
    const loan_id = window.location.search
      ? parseInt(window.location.search.split("=")[1])
      : null;
    let chat_detail = this.props.chat_list.filter(
      item => item.loan_id === loan_id
    )[0];
    this.props.setMessage({ chat_detail });
  }
  handleChange = value => {
    this.props.setMessage(value);
  };
  render() {
    return (
      <Card>
        <CardBody>
          <div className="text-center p-2">
            <b>{this.props.chat_detail.username}</b> <Badge status="success" />
          </div>
          <hr />
          <div style={{ height: "78vh" }}>
            <ul
              id="chat"
              onScroll={() => {
                let scrollPosition = document.getElementById("chat").scrollTop;
                if (
                  scrollPosition === 0 &&
                  this.props.message_list.length < 15
                ) {
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
                    this.setScroll(750);
                  }, 500);
                }
              }}
            >
              {/* <InfiniteScroll
                dataLength={this.props.message_list.length}
                next={this.fetchMoreData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                scrollableTarget="chat"
                inverse={true}
              > */}
              <div
                className="text-center"
                hidden={this.props.message_list.length >= 15}
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
                            {moment(item.date).format("DD-MM-YYYY, h:mm:ss a")}
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
              {/* </InfiniteScroll> */}
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
              type="textarea"
              className="m-0 mr-3"
              autoFocus
              style={this.setInputHeight()}
              onChange={e => this.setState({ message: e.target.value })}
            />
            <Button
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
              color="primary"
            >
              <FiSend />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
}
const mapStateToProps = state => {
  return {
    message_list: state.message.message_list,
    chat_list: state.message.chat_list,
    chat_detail: state.message.chat_detail,
    username: state.user.account
  };
};
export default connect(mapStateToProps, {
  setMessage
})(ChatMenu);
