import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!isHuman) return;

    try {
      setLoading(true);
      const user = await login({ email, password });
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

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

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleLogin}>
                    {/* Email */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                      type="submit"
                      className="btn btn-success w-100 mb-3"
                      disabled={!isHuman || loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Links */}
                    <div className="d-flex justify-content-end small">
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