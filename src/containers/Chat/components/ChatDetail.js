import React, { Component } from "react";

// images
import { FormGroup, Label } from "reactstrap";
import { Avatar, Image } from "antd";
import { connect } from "react-redux";
import axios from "axios";

class ChatDetail extends Component {
  state = {
    imageUrl: null
  };

  getImageURL = async (image) => {
    let resultData = await new Promise((resolve, reject) => {
      axios.post(
        process.env.REACT_APP_API_STORATE_END_POINT, {
          filename: image.filename,
          folder: `whatsapp/${image.folder}`
        }
      ).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });

    this.setState({ imageUrl: resultData.data.result });
  }

  render() {
    const chatDetail = this.props.chat_detail;
    if (chatDetail.profile_filename !== null && chatDetail.profile_folder !== null && this.state.imageUrl === null) {
      this.getImageURL({ filename: chatDetail.profile_filename, folder: chatDetail.profile_folder });
    }

    return (
      <div className="chat-detail-container p-3">
        <div className="text-center py-3">
          {this.state.imageUrl ? (
            <div className="imgProfilePic">
              <Image
                src={this.state.imageUrl}
                alt="profile"
              />
            </div>
          ) : (
            <Avatar size={100} className="avatar-chat-details">
              <b>
                {chatDetail.username
                  ? chatDetail.username.split("")[0]
                  : null}
              </b>
            </Avatar>
          )}
        </div>
        <br />
        <div className="p-3">
          <FormGroup row>
            <Label sm={4} className="text-right">Nama</Label>
            <Label sm={8} className="text-detail-value">: {chatDetail.username}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Loan ID</Label>
            <Label sm={8} className="text-detail-value">: {chatDetail.loan_id}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Loan Status</Label>
            <Label sm={8} className="text-detail-value">: {chatDetail.loan_status}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Loan Amount</Label>
            <Label sm={8} className="text-detail-value">: {chatDetail.loan_amount}</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4} className="text-right">Virtual Account</Label>
            <Label sm={8} className="text-detail-value">: {chatDetail.va_number}</Label>
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
