import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Accordion } from "react-bootstrap";
import { Mail, MapPin, Clock, Headset } from "lucide-react";
import { sendSupportMessage } from "../services/supportService";
import { getStoredUser } from "../services/authService";

const FAQS = [
  {
    q: "How do I book a bike?",
    a: "Open Browse Bikes, choose a bike, select pick-up and drop-off dates and click Request to Book. You need to be logged in.",
  },
  {
    q: "When is my booking confirmed?",
    a: "Each booking starts as Pending. The bike owner approves or rejects it, and you can see the status in your dashboard.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. Open your dashboard and cancel any booking that has not started yet.",
  },
  {
    q: "How do I list my own bike?",
    a: "Register as a Bike Provider. After an admin approves your account you can add bikes with a photo and daily rent.",
  },
];

const Contact = () => {
  const user = getStoredUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    try {
      setLoading(true);
      const res = await sendSupportMessage(formData);
      setStatus({ type: "success", text: res.data.message });
      setFormData({ ...formData, subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "danger", text: err.response?.data?.message || "Could not send your message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { icon: Mail, title: "Email", text: "support@riderent.pk" },
    { icon: MapPin, title: "Office", text: "Lahore, Pakistan" },
    { icon: Clock, title: "Support hours", text: "Mon – Sat, 9:00 AM – 6:00 PM" },
    { icon: Headset, title: "Instant help", text: "Use the chat button at the bottom right" },
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Contact & Support</h2>
        <p className="text-muted mb-0">
          Have a question about a booking or your account? Send us a message and our team will reply by email.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Send a message</h5>

            {status.text && <Alert variant={status.type}>{status.text}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Choose a topic</option>
                  <option>Booking issue</option>
                  <option>Payment question</option>
                  <option>Provider account</option>
                  <option>Report a problem</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success" className="px-4" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm p-4 mb-4">
            {infoItems.map((item) => (
              <div key={item.title} className="d-flex align-items-start gap-3 mb-3">
                <div className="rounded-circle p-2 bg-success bg-opacity-10 text-success">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="fw-semibold">{item.title}</div>
                  <div className="text-muted small">{item.text}</div>
                </div>
              </div>
            ))}
          </Card>

          <h6 className="fw-bold mb-2">Frequently asked questions</h6>
          <Accordion>
            {FAQS.map((faq, idx) => (
              <Accordion.Item eventKey={String(idx)} key={faq.q}>
                <Accordion.Header>{faq.q}</Accordion.Header>
                <Accordion.Body className="text-muted small">{faq.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
