import React, { Component } from "react";

// images
import { FormGroup, Label } from "reactstrap";
import { Avatar } from "antd";

export default class ChatDetail extends Component {
  render() {
    return (
      <div id="chat-detail-container" className="p-3">
        <div className="text-center py-3">
          <Avatar size={100}>
            <b>A</b>
          </Avatar>
        </div>
        <br />
        <div className="p-3">
          <FormGroup row>
            <Label sm={4}>Nama</Label>
            <Label sm={8}>Adele</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Loan Id</Label>
            <Label sm={8}>10002121</Label>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>No VA</Label>
            <Label sm={8}>033231</Label>
          </FormGroup>
        </div>
      </div>
    );
  }
}
