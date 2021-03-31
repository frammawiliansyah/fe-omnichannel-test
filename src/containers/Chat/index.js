import React, { Component } from "react";
import {
  CardBody,
  Card,
  Input,
  CardFooter,
  Row,
  Col,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import { FiSend } from "react-icons/fi";

// images
import { Avatar, Space, Badge } from "antd";
import "./style.scss";

class Dashboard extends Component {
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
    ]
  };
  componentDidMount() {
    this.setScroll(this.state.scrollPosition);
  }
  setScroll(numb) {
    document.getElementById("chat").scrollTop = numb;
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
                <Button
                  hidden={data.length === 0}
                  color="secondary"
                  onClick={() => this.setState({ data: [...data, ...data] })}
                >
                  Memuat data...
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
        <CardFooter className="py-4">
          <Row>
            <Col xs={11}>
              <Input
                type="text"
                placeholder="Type a message"
                className="input-message"
                autoFocus
              />
            </Col>
            <Col xs={1}>
              <Button style={{ borderRadius: "50%" }} color="primary">
                <FiSend />
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    storeState: state
  };
}

export default Dashboard = connect(mapStateToProps)(Dashboard);
