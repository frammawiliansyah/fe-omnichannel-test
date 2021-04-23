import React, { Component } from "react";

// icons
import { FiSearch } from "react-icons/fi";

// images
import logo from "../../../assets/images/logo.svg";
import { Button, Input, Spinner } from "reactstrap";
import { Avatar, List } from "antd";
import { connect } from "react-redux";
import { setMessage } from "../../../redux/action/message_action";
import InfiniteScroll from "react-infinite-scroll-component";

class ChatList extends Component {
  state = {
    loan_id: null
  };
  getData = async loan_id => {
    let message_list = [];
    let chat_detail = this.props.chat_list.filter(
      item => item.loan_id === loan_id
    )[0];
    message_list = [
      {
        loan_id: 1,
        username: "Adele",
        date: "2020-06-20 08:03",
        message: "Lorem ipsum dolor sit amet"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "2020-06-20 08:04",
        message: "consectetur adipiscing elit"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "2020-06-20 08:06",
        message: "consectetur adipiscing"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "2020-07-20 08:08",
        message: "Lorem"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "2020-07-20 08:09",
        message: "consectetur adipiscing elit"
      },
      {
        loan_id: 2,
        username: "Boby",
        date: "2020-08-20 09:06",
        message: "consectetur adipiscing"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "2020-09-20 10:08",
        message: "Lorem"
      },
      {
        loan_id: 1,
        username: "Adele",
        date: "2020-09-20 10:09",
        message: "Lorem"
      }
    ];
    this.props.setMessage({ load_message: true, message_list: [] });
    setTimeout(async () => {
      await this.props.setMessage({ chat_detail, message_list });
      this.props.setMessage({ load_message: false });
    }, 500);
  };
  getChatList() {
    setTimeout(() => {
      this.props.setMessage({
        chat_list: [
          ...this.props.chat_list,
          {
            loan_id: 100001,
            username: "Boby",
            message: "Hello",
            va_number: 111
          }
        ]
      });
    }, 1500);
  }
  onSearch() {
    let { loan_id } = this.state;
    if (loan_id) {
      this.setState({ loan_id });
      let new_chat_list = this.props.chat_list.filter(
        item => item.loan_id === parseInt(loan_id)
      );
      this.props.setMessage({ chat_list: [...new_chat_list] });
    }
  }
  render() {
    return (
      <div className="chat-list-container">
        <div className="brand">
          <img src={logo} alt="" className="img-fluid" />
        </div>
        <div className="list-unstyled components px-2">
          <div className="text-center input-search m-2 p-2">
            <div className="d-flex align-items-stretch">
              <Input
                placeholder="Cari loan Id"
                className="mr-2 custom-input-theme"
                type="number"
                value={this.state.loan_id}
                onChange={e => this.setState({ loan_id: e.target.value })}
              />
              <Button color="primary" onClick={() => this.onSearch()}>
                <FiSearch />
              </Button>
            </div>
          </div>
          <br />
          <div id="chat-history" style={{ overflow: "auto", height: "74vh" }}>
            <InfiniteScroll
              dataLength={this.props.chat_list}
              next={() => this.getChatList()}
              hasMore={
                this.props.chat_list.length > 0 &&
                this.props.chat_list.length <= 20
              }
              loader={
                <div className="text-center p-2">
                  Memuat data... <Spinner size="sm" color="primary" />
                </div>
              }
              scrollableTarget="chat-history"
              style={{ overflow: "hidden" }}
            >
              {this.props.chat_list.map((item, index) => (
                <div className="chat-list p-2">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => this.getData(item.loan_id)}
                  >
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar size={50}>
                            <b>
                              {item.username
                                ? item.username.split("")[0]
                                : null}
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
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
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
