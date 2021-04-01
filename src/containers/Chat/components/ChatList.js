import React, { Component } from "react";
import { Link } from "react-router-dom";

// icons
import { FiSearch } from "react-icons/fi";

// images
import logo from "../../../assets/images/logo.svg";
import { Button, Input } from "reactstrap";
import { Avatar, List } from "antd";

class ChatList extends Component {
  render() {
    const data = [
      {
        loan_id: 100001,
        username: "Boby",
        message: "Hello"
      },
      {
        loan_id: 100002,
        username: "Rudi",
        message: "How Are You"
      },
      {
        loan_id: 100002,
        username: "Mike",
        message: "Good Morning"
      },
      {
        loan_id: 100004,
        username: "Jordan",
        message:
          "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
      },
      {
        loan_id: 100005,
        username: "Kylie",
        message: "Terimakasih"
      },
      {
        loan_id: 100006,
        username: "Adele",
        message: "See You"
      }
    ];
    return (
      <div id="chat-list-container">
        <div className="brand">
          <img src={logo} alt="" className="img-fluid" />
        </div>
        <div className="list-unstyled components px-2">
          <div className="text-center input-search m-2 p-2">
            <div className="d-flex align-items-stretch">
              <Input placeholder="Cari loan Id" className="mr-2" />
              <Button color="primary">
                <FiSearch />
              </Button>
            </div>
          </div>
          <br />
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <div className="chat-list p-2">
                <Link to={`?loan_id=${item.loan_id}`}>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar size={50}>
                          <b>
                            {item.username ? item.username.split("")[0] : null}
                          </b>
                        </Avatar>
                      }
                      title={item.username}
                      description={
                        item.message.split("").length > 10
                          ? item.message.substring(0, 10) + "..."
                          : item.message
                      }
                    />
                    <div>#{item.loan_id}</div>
                  </List.Item>
                </Link>
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

export default ChatList;
