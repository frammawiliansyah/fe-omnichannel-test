import React, { Component } from "react";
import axios from "axios";

// icons
import { FiSearch } from "react-icons/fi";

// images
import logo from "../../../assets/images/logo.svg";
import { Button, Input, Spinner } from "reactstrap";
import { Avatar, List, Spin } from "antd";
import { connect } from "react-redux";
import { setMessage } from "../../../redux/action/message_action";
import InfiniteScroll from "react-infinite-scroll-component";

class ChatList extends Component {
  state = {
    loan_id: null,
    chat_list: this.props.chat_list,
    chat_detail: null,
    loans: [],
    loading: false,
    intervalId: null
  };

  componentDidMount() {
    this.loanDataAPI();
    const addInterval = setInterval(this.countdownTimer, 15000);
    this.setState({intervalId: addInterval});
  }
  
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  countdownTimer = async => {
    const { loan_id, chat_detail } = this.state;

    if (loan_id !== null && chat_detail !== null) {
      console.log("[WINDOWS.ACTIVE.REFRESH]", new Date());
      this.getData(loan_id);
      this.refreshData();
    } else {
      console.log("[WINDOWS.STANDBY.NOREFRESH]", new Date());
    }
  }

  loanDataAPI = async () => {
    this.setState({ loading: true });

    const response = await axios.post(
      process.env.REACT_APP_API_END_POINT + "/omnichannel/loans",
      {}
    );

    if (response.status === 200 && response.data.status === 'SUCCESS') {
      await this.props.setMessage({
        load_message: false,
        message_list: [],
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
        }
      });

      this.setState({ loans: response.data.loanData, loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  refreshData = () => {
    axios.post(process.env.REACT_APP_API_END_POINT + "/omnichannel/chats/refresh", {
      chat_id: this.props.chat_detail.chat_id
    });
  }
  
  getData = async loanId => {
    const { loans } = this.state; 
    const selected = loans.find( ({ id }) => Number(id) === Number(loanId) );
    const chat_detail = {
      number: selected.pj_loan_detail.mobileNumber,
      loan_id: selected.id,
      username: selected.pj_loan_detail.fullName.toUpperCase(),
      va_number: selected.pj_loan_disburse.virtualAccountNumber,
      loan_status: selected.loanStatus.toUpperCase(),
      loan_amount: selected.loanAmount,
    };

    this.setState({
      loans: [ selected ],
      loan_id: loanId
    });

    const getContactDetail = await this.getContactDetail(chat_detail);

    if (getContactDetail.status) {
      chat_detail.contact_id = getContactDetail.data.id;
      chat_detail.chat_id = getContactDetail.data.chat.id;
      chat_detail.admin_user_id = this.props.user.id;

      await this.props.setMessage({
        load_message: true,
        message_list: [],
        chat_detail,
      });

      const getChatData = await this.getChatData(chat_detail.loan_id);

      if (getChatData.status) {
        const message_list = getChatData.data[0].chat.incoming_messages.concat(getChatData.data[0].chat.outgoing_messages);
        await this.props.setMessage({
          load_message: false,
          message_list
        });

        this.setState({ chat_detail });
      } else {
        await this.props.setMessage({ load_message: false });
      }
    }
  };

  getContactDetail = async payload => {
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
      console.log("getContactDetail.failed", error);
    } finally {
      return resultData;
    }
  }

  getChatData = async loan_id => {
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
      console.log("getChatData.failed", error);
    } finally {
      return resultData;
    }
  }

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

  onSearch = async () => {
    let { loan_id } = this.state;

    if (loan_id === undefined && loan_id === null && loan_id === '') {
      await this.loanDataAPI();
    } else {
      this.setState({ loading: true });

      const response = await axios.post(
        process.env.REACT_APP_API_END_POINT + "/omnichannel/loans",
        { loan_id }
      );
  
      if (response.status === 200 && response.data.status === 'SUCCESS') {
        this.setState({
          loans: response.data.loanData,
          loading: false
        });
      } else {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { loans, loading } = this.state;

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
              {loading ? (
                <div className="chat-list p-2 demo-loading">
                  <div>
                    <List.Item>
                      <Spin /> Fetching Data ...
                    </List.Item>
                  </div>
                </div>
              ) : (
                <div>
                  {loans.map((item, index) => (
                    <div key={`chat-list-${index}`} className="chat-list p-2">
                      <div style={{ cursor: "pointer" }} onClick={() => this.getData(item.id)}>
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
                </div>
              )}
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
