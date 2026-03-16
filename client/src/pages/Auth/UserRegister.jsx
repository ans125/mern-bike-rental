import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration submitted. Waiting for admin approval.");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-2 text-center">User Registration</h3>
              <p className="text-muted text-center mb-4">
                Create your account to rent bikes. Verification is required
                before approval.
              </p>

              <Form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="03xx-xxxxxxx"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Verification Section */}
                <hr />
                <h6 className="fw-bold mt-3 mb-3">Identity Verification</h6>

                <Form.Group className="mb-3">
                  <Form.Label>ID Card Image</Form.Label>
                  <Form.Control type="file" accept="image/*" required />
                  <Form.Text className="text-muted">
                    Upload a clear image of your government-issued ID.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Selfie with ID</Form.Label>
                  <Form.Control type="file" accept="image/*" required />
                  <Form.Text className="text-muted">
                    Upload a selfie holding your ID near your face.
                  </Form.Text>
                </Form.Group>

                {/* Approval Info */}
                <div className="bg-light p-3 rounded mb-4">
                  <small className="text-muted">
                    Note: Your account will remain <strong>pending</strong>{" "}
                    until approved by the admin. You will be able to rent bikes
                    after approval.
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

export default UserRegister;