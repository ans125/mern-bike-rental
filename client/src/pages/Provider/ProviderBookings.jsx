import React, { useEffect, useMemo, useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import StatusBadge from "../../components/StatusBadge";
import TablePagination from "../../components/TablePagination";
import BookingDetailsModal from "../../components/BookingDetailsModal";
import usePagination from "../../hooks/usePagination";
import { getProviderBookings, updateBookingStatus, cancelBooking } from "../../services/bookingService";
import { confirmAction, showSuccess, showError, apiError } from "../../utils/alerts";
import { Table, Badge, Spinner, Button, Nav, Form } from "react-bootstrap";
import { Calendar, User as UserIcon, Bike as BikeIcon, Check, X, MessageSquare } from "lucide-react";

const FILTERS = [
  { key: "pending", label: "Requests" },
  { key: "approved", label: "Accepted" },
  { key: "ongoing", label: "On ride" },
  { key: "completed", label: "Completed" },
  { key: "closed", label: "Cancelled / Rejected" },
  { key: "all", label: "All" },
];

const formatDate = (date) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data);
    } catch (err) {
      showError(apiError(err, "Could not load bookings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const matches = (b, key) =>
    key === "all" ? true : key === "closed" ? ["cancelled", "rejected"].includes(b.status) : b.status === key;

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return bookings.filter(
      (b) => matches(b, filter) && (!text || `${b.user?.name} ${b.bike?.name}`.toLowerCase().includes(text))
    );
  }, [bookings, filter, query]);
  const pagination = usePagination(filtered, 10);

  const handleStatus = async (booking, status) => {
    const accept = status === "approved";
    const ok = await confirmAction({
      title: accept ? "Accept this booking?" : "Reject this booking?",
      text: accept
        ? `${booking.user?.name} will see your phone and shop address.`
        : `${booking.user?.name}'s request for ${booking.bike?.name} will be rejected.`,
      confirmText: accept ? "Accept" : "Reject",
      danger: !accept,
    });
    if (!ok) return;
    try {
      await updateBookingStatus(booking._id, status);
      showSuccess(accept ? "Booking accepted" : "Booking rejected");
      fetchBookings();
    } catch (err) {
      showError(apiError(err, "Failed to update booking"));
    }
  };

  const handleCancel = async (booking) => {
    const ok = await confirmAction({ title: "Cancel this accepted booking?", confirmText: "Yes, cancel", cancelText: "Keep booking", danger: true });
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
    <ProviderLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Bookings</h3>
        <p className="text-muted small mb-0">
          Accept requests, chat with customers, hand over the bike and mark the bike returned.
          You earn 90% of each accepted booking.
        </p>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
          <Nav variant="pills" className="flex-wrap gap-1 small">
            {FILTERS.map((f) => (
              <Nav.Item key={f.key}>
                <Nav.Link active={filter === f.key} onClick={() => setFilter(f.key)} className="py-1 px-3" role="button">
                  {f.label} <Badge bg="light" text="dark" className="ms-1">{bookings.filter((b) => matches(b, f.key)).length}</Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Form.Control size="sm" style={{ maxWidth: "240px" }} placeholder="Search customer or bike" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <Calendar size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No bookings here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase">
                <tr>
                  <th className="border-0">Customer</th>
                  <th className="border-0">Vehicle</th>
                  <th className="border-0 text-center">Rental Period</th>
                  <th className="border-0 text-center">Status</th>
                  <th className="border-0 text-end">Your Earning</th>
                  <th className="border-0 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center border" style={{ width: "32px", height: "32px" }}>
                          <UserIcon size={14} className="text-success" />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{booking.user?.name || "Customer"}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{booking.user?.city || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <BikeIcon size={14} className="text-primary me-1" />
                      <span className="fw-medium">{booking.bike?.name || "Bike"}</span>
                    </td>
                    <td className="text-center small">
                      {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </td>
                    <td className="text-center"><StatusBadge booking={booking} /></td>
                    <td className="text-end">
                      <div className="text-success fw-bold">Rs. {(booking.providerEarning || 0).toLocaleString()}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>of Rs. {(booking.totalPrice || 0).toLocaleString()}</div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {booking.status === "pending" && (
                          <>
                            <Button size="sm" variant="success" onClick={() => handleStatus(booking, "approved")}>
                              <Check size={14} /> Accept
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleStatus(booking, "rejected")} title="Reject">
                              <X size={14} />
                            </Button>
                          </>
                        )}
                        {booking.status !== "pending" && (
                          <Button size="sm" variant="outline-success" onClick={() => setOpenId(booking._id)}>
                            <MessageSquare size={14} /> {booking.status === "approved" ? "Hand over" : booking.status === "ongoing" ? "Return" : "Details"}
                          </Button>
                        )}
                        {booking.status === "approved" && new Date(booking.startDate) > new Date() && (
                          <Button size="sm" variant="outline-secondary" onClick={() => handleCancel(booking)} title="Cancel">
                            <X size={14} />
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
      </div>

      <BookingDetailsModal bookingId={openId} onHide={() => setOpenId(null)} onChanged={fetchBookings} />
    </ProviderLayout>
  );
};

export default ProviderBookings;
