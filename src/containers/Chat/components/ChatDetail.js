import React, { Component } from "react";

// images
import { FormGroup, Label } from "reactstrap";
import { Avatar } from "antd";
import { connect } from "react-redux";

class ChatDetail extends Component {
  render() {
    return (
      <div className="chat-detail-container p-3">
        <div className="text-center py-3">
          <Avatar size={100} className="avatar-chat-details">
            <b>
              {this.props.chat_detail.username
                ? this.props.chat_detail.username.split("")[0]
                : null}
            </b>
          </Avatar>
        </div>
        <br />
        <div className="p-3">
          <FormGroup row>
            <Label sm={4} className="text-right">Nama</Label>
            <Label sm={8} className="text-detail-value">: {this.props.chat_detail.username}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Loan ID</Label>
            <Label sm={8} className="text-detail-value">: {this.props.chat_detail.loan_id}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Virtual Account</Label>
            <Label sm={8} className="text-detail-value">: {this.props.chat_detail.va_number}</Label>
          </FormGroup>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    chat_detail: state.message.chat_detail
  };
};
export default connect(mapStateToProps)(ChatDetail);
