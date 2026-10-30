import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllBookings } from "../../services/adminService";
import { Table, Badge, Spinner, Form, Row, Col } from "react-bootstrap";
import StatusBadge from "../../components/StatusBadge";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { Calendar, User as UserIcon, Bike as BikeIcon, Clock } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        (status === "all" || b.status === status) &&
        (!text || `${b.user?.name} ${b.provider?.name} ${b.bike?.name} ${b._id}`.toLowerCase().includes(text))
    );
  }, [bookings, status, query]);
  const pagination = usePagination(filtered, 12);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Rental Records</h3>
          <p className="text-muted small mb-0">Full history of transactions on the platform</p>
        </div>
        <Badge bg="info" className="p-2 px-3 rounded-pill shadow-sm text-white border-0">
          {bookings.length} Total Bookings
        </Badge>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Accepted</option>
              <option value="ongoing">On ride</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={8}>
            <Form.Control placeholder="Search customer, owner, bike or booking ID" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Col>
        </Row>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <Clock size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No booking logs found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase fw-bold">
                <tr className="border-bottom">
                  <th className="py-3 ps-3 border-0">Booking ID</th>
                  <th className="py-3 border-0">User / Customer</th>
                  <th className="py-3 border-0">Vehicles</th>
                  <th className="py-3 border-0 text-center">Rental Period</th>
                  <th className="py-3 border-0 text-center">Status</th>
                  <th className="py-3 pe-3 border-0 text-end">Total / Commission</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((booking) => (
                  <tr key={booking._id} className="border-bottom hover-bg-light transition-all">
                    <td className="ps-3 py-3 border-0">
                       <span className="fw-bold text-dark font-monospace" style={{fontSize: "0.8rem"}}>
                          #{booking._id.slice(-8).toUpperCase()}
                       </span>
                    </td>
                    <td className="border-0">
                      <div className="d-flex align-items-center gap-2">
                         <div className="rounded-circle bg-success bg-opacity-10 p-1 px-2 d-flex align-items-center justify-content-center border" style={{width: "32px", height: "32px"}}>
                            <UserIcon size={14} className="text-success" />
                         </div>
                         <div>
                            <div className="fw-bold text-dark mb-0 d-block lh-1 text-capitalize">{booking.user?.name || "Deleted"}</div>
                            <div className="text-muted" style={{fontSize: "0.7rem"}}>{booking.user?.email || "-"}</div>
                         </div>
                      </div>
                    </td>
                    <td className="border-0">
                       <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-1 px-2 d-flex align-items-center justify-content-center border" style={{width: "32px", height: "32px"}}>
                             <BikeIcon size={14} className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-medium text-dark mb-0 lh-1">{booking.bike?.name || "Bike Removed"}</div>
                            <div className="text-muted" style={{fontSize: "0.7rem"}}>Owner: {booking.provider?.name || "-"}</div>
                          </div>
                       </div>
                    </td>
                    <td className="text-center border-0 small">
                       <div className="d-inline-flex align-items-center gap-2 alert alert-light p-1 px-3 border border-light shadow-sm mb-0 rounded-pill">
                          <Calendar size={12} className="text-secondary" />
                          <span className="fw-bold">{formatDate(booking.startDate)}</span>
                          <span className="text-muted opacity-50">➔</span>
                          <span className="fw-bold">{formatDate(booking.endDate)}</span>
                       </div>
                    </td>
                    <td className="text-center border-0">
                       <StatusBadge booking={booking} />
                    </td>
                    <td className="text-end pe-3 border-0">
                       <div className="fw-bold text-dark">Rs. {(booking.totalPrice || 0).toLocaleString()}</div>
                       <div className="text-success small">Rs. {(booking.commission || 0).toLocaleString()} fee</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <TablePagination pagination={pagination} label="bookings" />
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;

 
