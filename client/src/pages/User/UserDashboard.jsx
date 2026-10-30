import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Table, Alert, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Mail, Calendar, Bike, XCircle, Phone, MapPin, MessageSquare, Clock, ShieldX } from "lucide-react";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import { getStoredUser, refreshStoredUser } from "../../services/authService";
import StatusBadge from "../../components/StatusBadge";
import TablePagination from "../../components/TablePagination";
import BookingDetailsModal from "../../components/BookingDetailsModal";
import usePagination from "../../hooks/usePagination";
import { confirmAction, showSuccess, showError, apiError } from "../../utils/alerts";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Accepted" },
  { key: "ongoing", label: "On ride" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Cancelled / Rejected" },
];

const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const UserDashboard = () => {
  const [user, setUser] = useState(getStoredUser() || {});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      showError(apiError(err, "Could not load your bookings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStoredUser().then((fresh) => fresh && setUser(fresh)).catch(() => {});
    fetchBookings();
  }, []);

  const filtered = useMemo(
    () =>
      bookings.filter((b) =>
        filter === "all" ? true : filter === "closed" ? ["cancelled", "rejected"].includes(b.status) : b.status === filter
      ),
    [bookings, filter]
  );
  const pagination = usePagination(filtered, 8);
  const countOf = (key) =>
    key === "all" ? bookings.length : key === "closed"
      ? bookings.filter((b) => ["cancelled", "rejected"].includes(b.status)).length
      : bookings.filter((b) => b.status === key).length;

  const handleCancel = async (booking) => {
    const ok = await confirmAction({
      title: "Cancel this booking?",
      text: `${booking.bike?.name || "Bike"} · ${formatDate(booking.startDate)}`,
      confirmText: "Yes, cancel",
      cancelText: "Keep booking",
      danger: true,
    });
    if (!ok) return;
    try {
      await cancelBooking(booking._id);
      showSuccess("Booking cancelled");
      fetchBookings();
    } catch (err) {
      showError(apiError(err, "Failed to cancel booking"));
    }
  };

  return (
    <Container className="py-5">
      {/* Verification status */}
      {!user.isApproved && user.verificationStatus === "rejected" && (
        <Alert variant="danger" className="d-flex gap-3">
          <ShieldX className="flex-shrink-0" />
          <div>
            <strong>Your account verification was rejected.</strong>
            <div className="small">Reason: {user.verificationNote || "Not given"}</div>
            <div className="small">Please <Link to="/contact">contact support</Link> to fix your documents.</div>
          </div>
        </Alert>
      )}
      {!user.isApproved && user.verificationStatus !== "rejected" && (
        <Alert variant="warning" className="d-flex gap-3">
          <Clock className="flex-shrink-0" />
          <div>
            <strong>Your CNIC is being verified.</strong>
            <div className="small">You can browse bikes now and book as soon as our team approves your account (usually within 24 hours).</div>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        {/* Profile */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 text-center">
            <div className="mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=198754&color=fff`}
                alt=""
                className="rounded-circle shadow-sm"
                width="100"
              />
            </div>
            <h4 className="fw-bold mb-1">{user.name}</h4>
            <div className="mb-3">
              <Badge bg={user.isApproved ? "success" : user.verificationStatus === "rejected" ? "danger" : "warning"} text={user.isApproved ? undefined : "dark"}>
                {user.isApproved ? "Verified customer" : user.verificationStatus === "rejected" ? "Verification rejected" : "Verification pending"}
              </Badge>
            </div>
            <div className="text-start border-top pt-3 small">
              <div className="d-flex align-items-center gap-2 mb-2"><Mail size={16} className="text-success" /> {user.email}</div>
              {user.phone && <div className="d-flex align-items-center gap-2 mb-2"><Phone size={16} className="text-success" /> {user.phone}</div>}
              {user.city && <div className="d-flex align-items-center gap-2"><MapPin size={16} className="text-success" /> {user.city}</div>}
            </div>
            <Button as={Link} to="/bike" variant="success" className="mt-4">Browse bikes</Button>
          </Card>
        </Col>

        {/* Bookings */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h4 className="fw-bold mb-0">My Rental History</h4>
                <div className="small text-muted">After the owner accepts, open “Details & chat” for the owner's contact details and chat.</div>
              </div>
            </div>

            <Nav variant="pills" className="mb-3 flex-wrap gap-1 small">
              {FILTERS.map((f) => (
                <Nav.Item key={f.key}>
                  <Nav.Link active={filter === f.key} onClick={() => setFilter(f.key)} className="py-1 px-3" role="button">
                    {f.label} <Badge bg="light" text="dark" className="ms-1">{countOf(f.key)}</Badge>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 bg-light rounded">
                <Bike size={48} className="text-muted mb-3 opacity-25" />
                <p className="text-muted mb-0">No bookings here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light small text-uppercase">
                    <tr>
                      <th className="border-0">Vehicle</th>
                      <th className="border-0">Period</th>
                      <th className="border-0 text-center">Status</th>
                      <th className="border-0 text-end">Price</th>
                      <th className="border-0 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagination.pageItems.map((b) => (
                      <tr key={b._id}>
                        <td>
                          {b.bike ? (
                            <Link to={`/bike/${b.bike._id}`} className="fw-bold text-dark text-decoration-none">{b.bike.name}</Link>
                          ) : (
                            <div className="fw-bold text-dark">Bike removed</div>
                          )}
                          <div className="small text-muted">{b.provider?.shopName || b.provider?.name} · {b.bike?.city}</div>
                        </td>
                        <td className="small">
                          <Calendar size={12} className="text-secondary me-1" />
                          {formatDate(b.startDate)} – {formatDate(b.endDate)}
                        </td>
                        <td className="text-center"><StatusBadge booking={b} /></td>
                        <td className="text-end fw-bold text-success">Rs. {b.totalPrice?.toLocaleString()}</td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button size="sm" variant="outline-success" onClick={() => setOpenId(b._id)} title="Details & chat">
                              <MessageSquare size={14} /> <span className="d-none d-xl-inline">Details</span>
                            </Button>
                            {["pending", "approved"].includes(b.status) && new Date(b.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)) && (
                              <Button size="sm" variant="outline-danger" onClick={() => handleCancel(b)} title="Cancel booking">
                                <XCircle size={14} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <TablePagination pagination={pagination} label="bookings" />
          </Card>
        </Col>
      </Row>

      <BookingDetailsModal bookingId={openId} onHide={() => setOpenId(null)} onChanged={fetchBookings} />
    </Container>
  );
};

export default UserDashboard;
