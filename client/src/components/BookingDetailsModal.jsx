import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Spinner, Row, Col, Button, Form, Alert, InputGroup } from "react-bootstrap";
import { Phone, MapPin, Mail, KeyRound, Send, RefreshCw, ShieldCheck, Check } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getBookingDetails, sendBookingMessage, confirmPickup, confirmReturn } from "../services/bookingService";
import { getStoredUser } from "../services/authService";
import { confirmAction, showSuccess, showError, apiError } from "../utils/alerts";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "pickedUp", label: "Picked up" },
  { key: "returned", label: "Returned" },
];
const reachedStep = (status) =>
  ({ pending: 0, approved: 1, ongoing: 2, completed: 3 })[status] ?? 0;

const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const SAFETY = {
  user: [
    "Meet at the owner's shop address shown here, during daytime.",
    "Bring your original CNIC and driving licence.",
    "Inspect the bike and take photos of any scratches before riding.",
    "Check the bike papers before you leave the shop.",
    "Pay rent at hand-over (cash or bank transfer) — never send advance money to unknown accounts.",
  ],
  provider: [
    "Hand over the bike only at your shop address.",
    "Check the customer's original CNIC and driving licence match the booking name.",
    "Press “Hand over” once the customer has the bike — this starts the ride.",
    "Take photos of the bike and fuel level with the customer before hand-over.",
    "When the bike comes back, inspect it and press “Mark returned”.",
  ],
};

const BookingDetailsModal = ({ bookingId, onHide, onChanged }) => {
  const me = getStoredUser();
  const viewer = me?.role === "provider" ? "provider" : "user";
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const chatEnd = useRef(null);

  const load = useCallback(async () => {
    if (!bookingId) return;
    try {
      const res = await getBookingDetails(bookingId);
      setBooking(res.data);
      setLoadError("");
    } catch (err) {
      setLoadError(apiError(err, "Could not load booking"));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    setLoading(true);
    setBooking(null);
    setLoadError("");
    load();
  }, [load]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [booking?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setBusy(true);
      const res = await sendBookingMessage(bookingId, text);
      setBooking((b) => ({ ...b, messages: res.data }));
      setText("");
    } catch (err) {
      showError(apiError(err, "Message not sent"));
    } finally {
      setBusy(false);
    }
  };

  const handlePickup = async () => {
    const ok = await confirmAction({
      title: "Hand over the bike?",
      text: "Confirm you have checked the customer's CNIC and licence and given them the bike.",
      confirmText: "Hand over",
    });
    if (!ok) return;
    try {
      setBusy(true);
      const res = await confirmPickup(bookingId);
      showSuccess(res.data.message);
      await load();
      onChanged?.();
    } catch (err) {
      showError(apiError(err, "Could not confirm pick-up"));
    } finally {
      setBusy(false);
    }
  };

  const handleReturn = async () => {
    const ok = await confirmAction({
      title: "Bike returned?",
      text: "Confirm you have received the bike back and checked its condition.",
      confirmText: "Mark returned",
    });
    if (!ok) return;
    try {
      const res = await confirmReturn(bookingId);
      showSuccess(res.data.message);
      await load();
      onChanged?.();
    } catch (err) {
      showError(apiError(err, "Could not complete the booking"));
    }
  };

  const other = booking && (viewer === "user" ? booking.provider : booking.user);
  const step = booking ? reachedStep(booking.status) : 0;
  const closed = booking && ["rejected", "cancelled"].includes(booking.status);

  return (
    <Modal show={!!bookingId} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold">Booking details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadError && !booking ? (
          <Alert variant="danger">{loadError}</Alert>
        ) : loading || !booking ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : (
          <>
            {/* Summary */}
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h5 className="fw-bold mb-1">{booking.bike?.name || "Bike removed"}</h5>
                <div className="text-muted small">
                  {formatDate(booking.startDate)} → {formatDate(booking.endDate)} · #{booking._id.slice(-6).toUpperCase()}
                </div>
              </div>
              <div className="text-end">
                <StatusBadge booking={booking} />
                <div className="fw-bold text-success mt-1">
                  Rs. {(viewer === "provider" ? booking.providerEarning : booking.totalPrice)?.toLocaleString()}
                  <span className="small text-muted fw-normal"> {viewer === "provider" ? "your earning" : "total"}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            {!closed && (
              <div className="d-flex justify-content-between mb-4 position-relative">
                {STEPS.map((s, i) => (
                  <div key={s.key} className="text-center flex-fill">
                    <div
                      className={`mx-auto rounded-circle d-flex align-items-center justify-content-center ${i <= step ? "bg-success text-white" : "bg-light text-muted border"}`}
                      style={{ width: "30px", height: "30px" }}
                    >
                      {i < step || (i === step && booking.status === "completed") ? <Check size={16} /> : i + 1}
                    </div>
                    <div className={`small mt-1 ${i <= step ? "fw-semibold" : "text-muted"}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {closed && <Alert variant="secondary">This booking was {booking.status}.</Alert>}

            {/* Contact */}
            {!booking.contactShared ? (
              !closed && (
                <Alert variant="warning" className="small">
                  Contact details and chat open after the owner accepts the request. Until then, personal phone numbers stay private.
                </Alert>
              )
            ) : (
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted mb-1">{viewer === "user" ? "Bike owner" : "Customer"}</div>
                    <div className="fw-bold">{viewer === "user" ? other.shopName || other.name : other.name}</div>
                    {viewer === "user" && other.shopName && other.shopName !== other.name && (
                      <div className="small text-muted">Owner: {other.name}</div>
                    )}
                    {other.phone && (
                      <div className="mt-2">
                        <a className="btn btn-sm btn-outline-success" href={`tel:${other.phone}`}>
                          <Phone size={14} /> {other.phone}
                        </a>
                      </div>
                    )}
                    {other.email && (
                      <div className="small mt-2"><Mail size={12} className="me-1" />{other.email}</div>
                    )}
                    {viewer === "provider" && other.licenseNumber && (
                      <div className="small mt-1">Licence: <span className="font-monospace">{other.licenseNumber}</span> (check original at pick-up)</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <div className="small text-muted mb-1">Pick-up & return location</div>
                    <div className="fw-semibold"><MapPin size={14} className="text-danger me-1" />{booking.provider.address || booking.provider.city}</div>
                    {booking.pickedUpAt && <div className="small mt-2">Picked up: {new Date(booking.pickedUpAt).toLocaleString()}</div>}
                    {booking.returnedAt && <div className="small">Returned: {new Date(booking.returnedAt).toLocaleString()}</div>}
                  </div>
                </Col>
              </Row>
            )}

            {/* Hand-over actions */}
            {viewer === "provider" && booking.status === "approved" && (
              <div className="border rounded p-3 mb-3 bg-light d-flex justify-content-between align-items-center">
                <span><KeyRound size={16} className="me-1" /> Customer collects the bike at your shop.</span>
                <Button variant="success" onClick={handlePickup} disabled={busy}>Hand over</Button>
              </div>
            )}
            {viewer === "provider" && booking.status === "ongoing" && (
              <div className="border rounded p-3 mb-3 bg-light d-flex justify-content-between align-items-center">
                <span>Bike is with the customer.</span>
                <Button variant="success" onClick={handleReturn}>Mark returned</Button>
              </div>
            )}

            {/* Safety */}
            {!closed && booking.status !== "completed" && (
              <div className="mb-3">
                <div className="fw-semibold small mb-1 d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" /> Safe hand-over checklist
                </div>
                <ul className="small text-muted mb-0">
                  {SAFETY[viewer].map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            )}

            {/* Chat */}
            {booking.contactShared && (
              <div className="border rounded">
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light">
                  <span className="fw-semibold small">Messages</span>
                  <Button size="sm" variant="link" className="p-0" onClick={load} aria-label="Refresh messages">
                    <RefreshCw size={14} />
                  </Button>
                </div>
                <div className="p-3" style={{ maxHeight: "240px", overflowY: "auto" }}>
                  {(booking.messages || []).length === 0 && (
                    <div className="small text-muted text-center">No messages yet. Agree on pick-up time here.</div>
                  )}
                  {(booking.messages || []).map((m) => {
                    const mine = String(m.sender) === String(me?._id);
                    return (
                      <div key={m._id} className={`d-flex mb-2 ${mine ? "justify-content-end" : ""}`}>
                        <div
                          className={`px-3 py-2 rounded-3 small ${mine ? "bg-success text-white" : "bg-light border"}`}
                          style={{ maxWidth: "75%", whiteSpace: "pre-wrap" }}
                        >
                          {!mine && <div className="fw-semibold">{m.senderName}</div>}
                          {m.text}
                          <div className={`mt-1 ${mine ? "text-white-50" : "text-muted"}`} style={{ fontSize: "0.7rem" }}>
                            {new Date(m.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEnd} />
                </div>
                {!closed && (
                  <Form onSubmit={handleSend} className="p-2 border-top">
                    <InputGroup>
                      <Form.Control placeholder="Write a message..." value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} />
                      <Button type="submit" variant="success" disabled={busy || !text.trim()} aria-label="Send">
                        <Send size={16} />
                      </Button>
                    </InputGroup>
                  </Form>
                )}
              </div>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingDetailsModal;
