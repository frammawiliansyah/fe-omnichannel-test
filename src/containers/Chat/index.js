import React, { Component } from "react";
import { CardBody, Card, Input, CardFooter, Button, Spinner } from "reactstrap";
import { FiSend } from "react-icons/fi";

// images
import { Avatar, Space, Badge } from "antd";
import "./style.scss";

class ChatMenu extends Component {
  state = {
    scrollPosition: 999999999,
    data: [
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Lorem ipsum dolor sit amet"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "consectetur adipiscing elit,"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message:
          "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "consectetur adipiscing elit"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "Lorem"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "Lorem consectetur adipiscing elit"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "ullamco laboris nisi ut aliquip ex ea commodo"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Ut enim ad minim veniam"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "Baik"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Hello"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "Holla"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Ut enim ad minim veniam"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Baik ?"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "Yes"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "ullamco laboris nisi"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "Ok"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "10:12AM, Today",
        message: "sed do eiusmod tempor"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "10:12AM, Today",
        message: "See you"
      }
    ],
    message: ""
  };
  componentDidMount() {
    this.setScroll(this.state.scrollPosition);
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
  render() {
    const data = this.state.data;
    return (
      <Card>
        <CardBody>
          <div className="text-center p-2">
            <b>Adele</b> <Badge status="success" />
          </div>
          <hr />
          <div style={{ height: "78vh" }}>
            <ul
              id="chat"
              onScroll={() => {
                let scrollPosition = document.getElementById("chat").scrollTop;
                if (scrollPosition === 0) {
                  this.setState({ data: [...data, ...data] });
                  this.setScroll(750);
                }
              }}
            >
              <div className="text-center">
                <Button color="secondary">
                  Memuat data... <Spinner size="sm" color="white" />
                </Button>
              </div>
              {data.map((item, index) => {
                return (
                  <li className={item.loan_id !== 2 ? "you" : "me"}>
                    <Space>
                      <div
                        hidden={item.loan_id === 2}
                        style={{
                          visibility:
                            index > 0 &&
                            data[index - 1].loan_id === item.loan_id
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
                          <h3>{item.date}</h3>
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
                            data[index - 1].loan_id === item.loan_id
                              ? "hidden"
                              : "visible"
                        }}
                      >
                        <Avatar size={50}>
                          <b>{item.username.split("")[0]}</b>
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

export default ChatMenu;
