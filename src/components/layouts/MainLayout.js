import React from "react";
import { Container } from "reactstrap";
import ChatList from "../../containers/Chat/components/ChatList";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSidebar: true
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({
      activeSidebar: !this.state.activeSidebar
    });
  }
  render() {
    const { children } = this.props;
    return (
      <main>
        <div className="d-flex align-items-stretch p-3">
          <ChatList />
          <div id="content" className="w-100">
            <Container fluid>{children}</Container>
          </div>
        </div>
      </main>
    );
  }
}

export default MainLayout;
