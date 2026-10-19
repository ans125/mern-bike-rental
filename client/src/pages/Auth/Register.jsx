import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const captchaQuestion = "5 + 4";

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "provider") {
      requestAnimationFrame(() => setRole("provider"));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (captchaAnswer.trim() !== "9") {
      return setError("Captcha verification failed.");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      const user = await register({ ...formData, role });
      navigate(user.role === "provider" ? "/provider/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={9} lg={7}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h3 className="fw-bold text-center mb-2">Create Your Account</h3>
              <p className="text-muted text-center mb-4">
                Register to rent bikes or list your own bikes on RideRent.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Register As
                  </Form.Label>
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="radio"
                      label="User (Rent a Bike)"
                      name="role"
                      value="user"
                      checked={role === "user"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="Bike Provider (List Bikes)"
                      name="role"
                      value="provider"
                      checked={role === "provider"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </Form.Group>

                {/* Basic Info */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="03xx-xxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Captcha */}
                <hr />
                <Form.Group className="mb-3">
                  <Form.Label>
                    Human Verification: <strong>{captchaQuestion}</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter answer"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Approval Notice */}
                {role === "provider" && (
                  <div className="bg-light p-3 rounded mb-4">
                    <small className="text-muted">
                      Provider accounts stay <strong>pending</strong> until
                      reviewed and approved by the admin. You can list bikes after approval.
                    </small>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{ backgroundColor: "#1f8f4a", border: "none" }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center small mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">Login</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
