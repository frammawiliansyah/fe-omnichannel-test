import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  CardImg,
  Card
} from "reactstrap";
import "./style.scss";

// images
import ImageLogin from "../../assets/images/art-login.svg";
import logoWhite from "../../assets/images/logo-white.svg";

import { connect } from "react-redux";
import { login } from "../../redux/action/user_action";
import { setModal } from "../../redux/action/modal_action";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "Nama pengguna atau kata sandi salah, silahkan coba kembali!",
      isHidden: true
    };
  }

  submitForm = e => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.login(
      username,
      password,
      this.submitFormSuccess,
      this.submitFormFailed
    );
  };

  submitFormSuccess = () => {
    this.props.history.push("/chat");
  };
  submitFormFailed = () => {
    this.setState({ isHidden: false });
  };

  handleChange = (item, value) => {
    this.setState({ [item]: value });
  };

  render() {
    return (
      <div className="auth" style={{ height: "100vh" }}>
        <Container>
          <Row>
            <Col md={{ size: 6, offset: 3 }} className="align-self-center">
              <Card>
                <CardBody>
                  <div className="text-center mb-2">
                    <img src={logoWhite} alt="Logo" />
                  </div>
                  <div>
                    <div style={{ textAlign: "center" }}>
                      <CardImg
                        top
                        style={{ width: "60%" }}
                        src={ImageLogin}
                        alt="Chat"
                      />
                    </div>
                    <CardBody>
                      <h3 className="font-weight-bold mt-2 text-center">
                        Dasbor Chat
                      </h3>
                      <Form className="mt-4" onSubmit={this.submitForm}>
                        <FormGroup>
                          <Label for="submitFormUsername">Nama Pengguna</Label>

                          <Input
                            type="text"
                            name="username"
                            id="submitFormUsername"
                            placeholder="Nama Pengguna"
                            value={this.state.email}
                            onChange={e =>
                              this.handleChange("username", e.target.value)
                            }
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="submitFormPassword">Kata Sandi</Label>

                          <Input
                            type="password"
                            name="password"
                            id="submitFormPassword"
                            placeholder="Kata Sandi"
                            value={this.state.password}
                            onChange={e =>
                              this.handleChange("password", e.target.value)
                            }
                          />
                        </FormGroup>
                        <Alert color="danger" hidden={this.state.isHidden}>
                          Nama pengguna atau kata sandi salah! Silahkan coba
                          kembali.
                        </Alert>
                        <FormGroup className="mt-3">
                          <Button
                            type="submit"
                            color="primary"
                            block
                            className="font-weight-bold"
                            onClick={this.submitForm}
                          >
                            MASUK
                          </Button>
                        </FormGroup>
                      </Form>
                    </CardBody>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { login, setModal })(Auth);
