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

import { io } from "socket.io-client";

class ChatList extends Component {
  state = {
    loan_id: null,
    contactList: [],
    chat_detail: {
      number: null,
      loan_id: null,
      username: null,
      message: null,
      va_number: null,
      loan_status: null,
      loan_amount: null,
      loan_length: null,
      contact_id: null,
      chat_id: null,
    },
    loadingList: true,
    totalList: 0,
    intervalId: null,
    socket: io(process.env.REACT_APP_API_END_POINT, {
      path: "/echo/"
    })
  };

  componentDidMount() {
    const self = this;
    const { socket } = self.state;

    self.contactListAPI();
    socket.on("connect", () => console.log("connect", socket.id));
    socket.on("disconnect", () => console.log("disconnect", socket.id));
    socket.on(`${process.env.REACT_APP_SOCK_END_POINT}`, payload => {
      self.consumerSocket(payload);
    });
  }

  publisherSocket = (payload) => {
    this.state.socket.emit(
      `${process.env.REACT_APP_SOCK_END_POINT}::CALLBACK`,
      payload
    );
  }

  consumerSocket = async (payload) => {
    const loanId = this.state.loan_id;
    if (loanId !== null) {
      console.log("Sock.Payload", payload);
    }
  }

  contactListAPI = async (onSearch = null) => {
    let chatDataList = {};
    const loanId = this.state.loan_id;
    const payload = { offset: this.props.chat_list.length };
    
    if (loanId !== null && loanId !== '' && loanId !== 0) payload.loan_id = loanId;

    const response = await axios.post(
      process.env.REACT_APP_API_END_POINT + "/omnichannel/loans",
      payload
    );

    if (response.status === 200 && response.data.status === 'SUCCESS') {
      if (onSearch === null) {
        chatDataList = { chat_list: this.props.chat_list.concat(response.data.loanData) }
      } else {
        chatDataList = { chat_list: response.data.loanData }
      }

      await this.props.setMessage( chatDataList );
      await this.setState({
        contactList: this.props.chat_list,
        totalList: response.data.countData
      });
    }

    this.setState({ loadingList: false });
  }

  contactDetailAPI = async (payload) => {
    let resultData = { status: false };

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_END_POINT + "/omnichannel/details",
        { ...payload }
      );
  
      if (response.status === 200 && response.data.status === 'SUCCESS') {
        resultData.status = true;
        resultData.data = response.data.contactData;
      }
    } catch(error) {
      console.log("contactDetailAPI", error);
    } finally {
      return resultData;
    }
  }

  chatDataAPI = async loan_id => {
    let resultData = { status: false };

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_END_POINT + "/omnichannel/chats",
        { loan_id }
      );
  
      if (response.status === 200 && response.data.status === 'SUCCESS') {
        resultData.status = true;
        resultData.data = response.data.chatData;
      }
    } catch(error) {
      console.log("chatDataAPI", error);
    } finally {
      return resultData;
    }
  }

  getContactDetail = async (loanId) => {
    const { contactList } = this.state; 
    const contactData = contactList.find( ({ id }) => Number(id) === Number(loanId) );
    const chatDetail = {
      number: contactData.pj_loan_detail.mobileNumber,
      loan_id: contactData.id,
      username: contactData.pj_loan_detail.fullName.toUpperCase(),
      va_number: contactData.pj_loan_disburse.virtualAccountNumber,
      loan_status: contactData.loanStatus.toUpperCase(),
      loan_amount: contactData.loanAmount,
    };

    this.setState({ contactList: [ contactData ], loan_id: loanId });
    const contactDetail = await this.contactDetailAPI(chatDetail);

    if (contactDetail.status) {
      chatDetail.contact_id = contactDetail.data.id;
      chatDetail.chat_id = contactDetail.data.chat.id;
      chatDetail.admin_user_id = this.props.user.id;

      await this.props.setMessage({
        message_list: [],
        load_message: true,
        chat_detail: chatDetail,
      });

      const chatData = await this.chatDataAPI(chatDetail.loan_id);

      if (chatData.status) {
        const message_list = chatData.data[0].chat.incoming_messages.concat(chatData.data[0].chat.outgoing_messages);
        await this.props.setMessage({
          load_message: false,
          message_list
        });

        this.setState({ chat_detail: chatDetail });
      } else {
        await this.props.setMessage({ load_message: false });
      }
    }
  };

  refreshData = () => {
    axios.post(process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/refresh", {
      chat_id: this.props.chat_detail.chat_id
    });
  }

  render() {
    const { contactList, totalList } = this.state;
    const chatList = this.props.chat_list;

    return (
      <div className="chat-list-container">
        <div className="brand">
          <img src={logo} alt="" className="img-fluid" />
        </div>
        <div className="list-unstyled components px-2">
          <div className="text-center input-search m-2 p-2">
            <div className="d-flex align-items-stretch">
              <Input
                type="number"
                placeholder="Search Loan ID ..."
                className="mr-2 custom-input-theme"
                value={this.state.loan_id || ''}
                onChange={e => this.setState({ loan_id: e.target.value })}
              />
              <Button color="primary" onClick={() => this.contactListAPI(true)}>
                <FiSearch />
              </Button>
            </div>
          </div>
          <br />
          <div id="chat-history" style={{ overflow: "auto", height: "74vh" }}>
            <InfiniteScroll
              dataLength={chatList.length}
              next={() => this.contactListAPI()}
              hasMore={chatList.length >= 0 && chatList.length < totalList}
              scrollableTarget="chat-history"
              style={{ overflow: "hidden" }}
              loader={
                <div className="text-center p-2">
                  Memuat data... <Spinner size="sm" color="primary" />
                </div>
              }
            >
              {contactList.map((item, index) => (
                <div key={`chat-list-${index}`} className="chat-list p-2">
                  <div style={{ cursor: "pointer" }} onClick={() => this.getContactDetail(item.id)}>
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar size={50}>
                            <b>
                              {item.pj_loan_detail.fullName
                                ? item.pj_loan_detail.fullName.split("")[0]
                                : null}
                            </b>
                          </Avatar>
                        }
                        title={item.pj_loan_detail.fullName.toUpperCase()}
                        description={
                          `ID (${item.id}) - HP (0${
                            Number(item.pj_loan_detail.mobileNumber)
                              .toString()
                              .replace(/\B(?=(\d{4})+(?!\d))/g, "-")
                          })`
                        }
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
    chat_list: state.message.chat_list,
    user: state.user.account,
    chat_detail: state.message.chat_detail
  };
};

export default connect(mapStateToProps, { setMessage })(ChatList);
