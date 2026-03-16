import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";



import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";


const Register = () => {
  
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("user");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const captchaQuestion = "5 + 4";
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "provider") {
      requestAnimationFrame(() => setRole("provider"));
    }
}, [searchParams]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (captchaAnswer !== "9") {
      alert("Captcha verification failed");
      return;
    }

    alert("Registration submitted. Waiting for admin approval.");
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
                  <Form.Control type="text" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" placeholder="03xx-xxxxxxx" required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>

                <hr />

                {/* Identity Verification */}
                <h6 className="fw-bold mb-3">Identity Verification</h6>

                <Form.Group className="mb-3">
                  <Form.Label>ID Card Image</Form.Label>
                  <Form.Control type="file" accept="image/*" required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Selfie with ID</Form.Label>
                  <Form.Control type="file" accept="image/*" required />
                </Form.Group>

                {/* Provider Extra Fields */}
                {role === "provider" && (
                  <>
                    <hr />
                    <h6 className="fw-bold mb-3">Bike Verification</h6>

                    <Form.Group className="mb-3">
                      <Form.Label>Bike Ownership Proof</Form.Label>
                      <Form.Control type="file" accept="image/*" required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Bike Number Plate</Form.Label>
                      <Form.Control type="text" required />
                    </Form.Group>
                  </>
                )}

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
                <div className="bg-light p-3 rounded mb-4">
                  <small className="text-muted">
                    Your account will remain <strong>pending</strong> until
                    reviewed and approved by the admin.
                  </small>
                </div>

                <Button
                  type="submit"
                  className="w-100"
                  style={{ backgroundColor: "#1f8f4a", border: "none" }}
                >
                  Submit for Approval
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;