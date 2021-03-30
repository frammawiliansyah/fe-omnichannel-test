import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { setModal } from "../../redux/action/modal_action";

class CustomModal extends Component {
  render() {
    if (this.props.modal) {
      return (
        <Modal
          isOpen={this.props.modal.isOpen}
          toggle={() => {
            this.props.setModal({
              isOpen: !this.props.modal.isOpen
            });
          }}
        >
          <ModalBody>
            <h2 className="text-center mb-3 mt-3">{this.props.modal.body}</h2>
          </ModalBody>
          <ModalFooter>
            <Button
              className="float-right"
              color="primary"
              onClick={() => {
                if (this.props.modal.confirmFunc) {
                  this.props.modal.confirmFunc();
                } else {
                  this.props.setModal({
                    isOpen: false
                  });
                }
              }}
            >
              {this.props.modal.confirmText}
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
    return null;
  }
}
const mapStateToProps = state => ({
  modal: state.modal
});
export default connect(mapStateToProps, { setModal })(CustomModal);
