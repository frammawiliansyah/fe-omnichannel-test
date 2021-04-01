import React, { Component } from "react";
import { Link } from "react-router-dom";

// icons
import { FiSearch } from "react-icons/fi";

// images
import logo from "../../../assets/images/logo.svg";
import { Button, Input } from "reactstrap";
import { Avatar, List } from "antd";
import { connect } from "react-redux";
import { setMessage } from "../../../redux/action/message_action";

class ChatList extends Component {
  getData = loan_id => {
    let chat_detail = this.props.chat_list.filter(
      item => item.loan_id === loan_id
    )[0];
    this.props.setMessage({ chat_detail });
    document.getElementById("chat").scrollTop = 999999999;
  };
  render() {
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
            dataSource={this.props.chat_list}
            renderItem={(item, index) => (
              <div className="chat-list p-2">
                <Link
                  to={`?loan_id=${item.loan_id}`}
                  onClick={() => this.getData(item.loan_id)}
                >
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
const mapStateToProps = state => {
  return {
    chat_list: state.message.chat_list
  };
};
export default connect(mapStateToProps, { setMessage })(ChatList);
