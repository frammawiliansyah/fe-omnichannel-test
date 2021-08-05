import React, { Component } from "react";
import axios from "axios";

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
    loan_id: null,
    chat_list: this.props.chat_list
  };
  componentDidMount() {
    this.numberListAPI();
  }
  numberListAPI = async payload => {
    const response = await axios.post(
      process.env.REACT_APP_API_END_POINT + "/conversation/get/numberList",
      {},
      {
        validateStatus: function() {
          return true;
        }
      }
    );
    if (response.data.numberList.length > 0) {
      this.setState({
        chat_list: response.data.numberList
      });
    }
  };
  getData = async number => {
    let message_list = [];
    let chat_detail = this.state.chat_list.filter(
      item => item.number === number
    )[0];
    const response = await axios.post(
      process.env.REACT_APP_API_END_POINT + "/conversation/get/chatData",
      { number },
      {
        validateStatus: function() {
          return true;
        }
      }
    );
    message_list = response.data.chatData;
    await this.props.setMessage({ load_message: true, message_list: [] });
    await this.props.setMessage({ chat_detail, message_list });
    await this.props.setMessage({ load_message: false });
  };
  getChatList() {
    setTimeout(() => {
      this.props.setMessage({
        chat_list: [
          ...this.state.chat_list,
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
      let new_chat_list = this.state.chat_list.filter(
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
              dataLength={this.state.chat_list}
              next={() => this.getChatList()}
              hasMore={
                this.state.chat_list.length > 0 &&
                this.state.chat_list.length <= 20
              }
              loader={
                <div className="text-center p-2">
                  Memuat data... <Spinner size="sm" color="primary" />
                </div>
              }
              scrollableTarget="chat-history"
              style={{ overflow: "hidden" }}
            >
              {this.state.chat_list.map((item, index) => (
                <div className="chat-list p-2">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => this.getData(item.number)}
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
                        title={`+62 ${
                            item
                              .number
                              .toString()
                              .replace(/\B(?=(\d{4})+(?!\d))/g, "-")
                          }`}
                        description={""}
                      />
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
