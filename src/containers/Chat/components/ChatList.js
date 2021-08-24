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
    loadingList: true,
    totalList: 0,
    intervalId: null,
    scrollPosition: 999999999,
    refreshLoading: false,
    refreshButton: false,
    socket: io(`${process.env.REACT_APP_API_END_POINT}`, {
      path: "/echo/"
    })
  };

  componentDidMount() {
    const self = this;
    const { socket } = self.state;

    self.contactListAPI();
    socket.on("connect", () => console.log("connect", socket.id));
    socket.on("disconnect", () => console.log("disconnect", socket.id));
    socket.on(`${process.env.REACT_APP_SOCK_END_POINT}`, data => {
      if (data.payload.reload) {
        self.getContactDetail(data.payload.loan_id);
        self.setState({ refreshLoading: false });
      } else {
        self.consumerSocket(data);
      }
    });
  }

  setScroll = (scroolNumber) => document.getElementById("chat").scrollTop = scroolNumber;

  publisherSocket = (payload) => {
    this.state.socket.emit(
      `${process.env.REACT_APP_SOCK_END_POINT}::CALLBACK`,
      payload
    );
  }

  consumerSocket = async (data) => {
    const chatDetail = this.props.chat_detail;

    if (chatDetail !== undefined && chatDetail !== null) {
      if (chatDetail.chat_id === data.payload.chatId) {
        const messageList = this.props.message_list.concat([ data.payload ]);
        await this.props.setMessage({ message_list: messageList });
        this.setScroll(this.state.scrollPosition);
      } else {
        let outgoingData = data.payload[1][0];
        if (outgoingData !== undefined && outgoingData.adminUserId !== undefined && outgoingData.adminUserId !== null) {
          if (chatDetail.chat_id === outgoingData.chatId) {
            let messageList = this.props.message_list;
                messageList.splice(-1);
            await this.props.setMessage({ message_list: messageList });
            const updateMessageList = this.props.message_list.concat([ outgoingData ]);
            await this.props.setMessage({ message_list: updateMessageList });
          }
        }
      }
    }
  }

  contactListAPI = async (onSearch = null) => {
    let chatDataList = {};
    const loanId = this.state.loan_id;
    let payload = { offset: this.props.chat_list.length };
    
    if (loanId !== null && loanId !== '' && loanId !== 0) payload.loan_id = loanId;
    if (loanId === '') {
      this.setState({ loan_id: null });
      payload.offset = 0;
    }

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

    this.setState({ loadingList: false, refreshButton: false });
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
    const { contactList, loan_id } = this.state; 
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

      await this.props.setMessage({ message_list: [], load_message: true, chat_detail: chatDetail });
      const chatData = await this.chatDataAPI(chatDetail.loan_id);

      if (chatData.status) {
        const messageList = chatData.data[0].chat.incoming_messages.concat(chatData.data[0].chat.outgoing_messages);
        messageList.sort((a,b) => {
          return new Date(a.messageDate) - new Date(b.messageDate);
        });

        await this.props.setMessage({ load_message: false, message_list: messageList });
        this.setScroll(this.state.scrollPosition);
      } else {
        await this.props.setMessage({ load_message: false });
      }
    }

    this.setState({ refreshLoading: false, refreshButton: true });
  };

  refreshData = () => {
    this.setState({ refreshLoading: true });
    axios.post(process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/refresh", {
      whatsapp_number: this.props.chat_detail.number
    });
  }

  render() {
    let showButton = false;
    const { contactList, totalList, refreshLoading, refreshButton } = this.state;
    const chatList = this.props.chat_list;
    const messageList = this.props.message_list;
    const chatDetail = this.props.chat_detail;
    if (chatDetail.number && messageList.length <= 0) showButton = true;

    return (
      <div className="chat-list-container">
        <div className="brand">
          <a href="/chat">
            <img src={logo} alt="" className="img-fluid" />
          </a>
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
          { showButton && refreshButton ? (
            <div className="text-center input-search m-2 p-2">
              {refreshLoading ? (
                <div className="text-center p-2">
                  Memuat data... <Spinner size="sm" color="primary" />
                </div>
              ) : (
                <Button color="success" onClick={() => this.refreshData()}>
                  <b style={{ "font-size" : "13px", "padding" : "0 15px" }}>
                    Sync Whatsapp {`+62 ${Number(chatDetail.number).toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ")}`}
                  </b>
                </Button>
              )}
            </div>
          ) : null}
          <br />
          <div id="chat-history" style={{ overflow: "auto", height: "74vh" }}>
            <InfiniteScroll
              dataLength={chatList.length}
              scrollableTarget="chat-history"
              style={{ overflow: "hidden" }}
              next={() => this.contactListAPI()}
              hasMore={chatList.length > 1 && chatList.length < totalList}
              loader={
                <div className="text-center p-2">
                  Memuat data... <Spinner size="sm" color="primary" />
                </div>
              }
            >
              {contactList.map((item, index) => (
                <div key={`chat-list-${index}`} className="chat-list p-2">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => this.getContactDetail(item.id)
                  }>
                    <List.Item>
                      <List.Item.Meta
                        title={item.pj_loan_detail.fullName.toUpperCase()}
                        avatar={
                          <Avatar size={50}>
                            <b>
                              {item.pj_loan_detail.fullName
                                ? item.pj_loan_detail.fullName.split("")[0]
                                : null}
                            </b>
                          </Avatar>
                        }
                        description={
                          <div>
                            {`ID (${item.id})`}
                            <br />
                            {`HP (+62 ${
                              Number(item.pj_loan_detail.mobileNumber)
                                .toString()
                                .replace(/\B(?=(\d{4})+(?!\d))/g, " ")
                            })`}
                          </div>
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
    message_list: state.message.message_list,
    user: state.user.account,
    chat_detail: state.message.chat_detail
  };
};

export default connect(mapStateToProps, { setMessage })(ChatList);
