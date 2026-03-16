import { Container, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [isHuman, setIsHuman] = useState(false);

  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center">
        <Col md={10} lg={8}>
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <Row>
              {/* Left Side Image */}
              <Col
                md={6}
                className="d-none d-md-flex align-items-center justify-content-center bg-light"
              >
                <img
                  src="/images/login.gif"
                  alt="Login"
                  className="img-fluid p-4"
                />
              </Col>

              {/* Login Form */}
              <Col md={6}>
                <div className="p-4">
                  <h4 className="fw-bold mb-2">Welcome Back</h4>
                  <p className="text-muted mb-4">
                    Login to continue using RideRent
                  </p>

                  <Form>
                    {/* Email */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                      />
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                      />
                    </Form.Group>

                    {/* Captcha */}
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="I'm not a robot"
                        checked={isHuman}
                        onChange={(e) => setIsHuman(e.target.checked)}
                      />
                    </Form.Group>

                    {/* Login Button */}
                    <button
                      type="button"
                      className="btn btn-success w-100 mb-3"
                      disabled={!isHuman}
                    >
                      Login
                    </button>

                    {/* Links */}
                    <div className="d-flex justify-content-between small">
                      <Link to="/forgot-password" className="text-decoration-none">
                        Forgot password?
                      </Link>
                      <Link to="/register" className="text-decoration-none">
                        Create account
                      </Link>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;