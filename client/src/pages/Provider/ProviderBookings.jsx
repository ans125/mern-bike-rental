import React, { useEffect, useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { getProviderBookings } from "../../services/bookingService";
import { Table, Badge, Spinner, Row, Col, Card } from "react-bootstrap";
import { Calendar, User as UserIcon, Bike as BikeIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getProviderBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching provider bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  const getStatusBadge = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    if (end < today) return <Badge bg="secondary" className="rounded-pill px-3">Completed</Badge>;
    return <Badge bg="success" className="rounded-pill px-3">Active</Badge>;
  };

  return (
    <ProviderLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Rental Activity</h3>
          <p className="text-muted small mb-0">Track bookings for your fleet</p>
        </div>
        <div className="d-flex gap-2">
            <Badge bg="light" className="text-dark border p-2 px-3 rounded-pill shadow-sm">
                {bookings.length} Total Bookings
            </Badge>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <Calendar size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No booking requests found for your fleet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase fw-bold">
                <tr className="border-bottom">
                  <th className="py-3 ps-3 border-0">Customer</th>
                  <th className="py-3 border-0 text-center">Vehicle</th>
                  <th className="py-3 border-0 text-center">Rental Period</th>
                  <th className="py-3 border-0 text-center">Status</th>
                  <th className="py-3 pe-3 border-0 text-end">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-bottom hover-bg-light transition-all">
                    <td className="ps-3 py-3 border-0">
                      <div className="d-flex align-items-center gap-2">
                         <div className="rounded-circle bg-success bg-opacity-10 p-1 px-2 d-flex align-items-center justify-content-center border" style={{width: "32px", height: "32px"}}>
                            <UserIcon size={14} className="text-success" />
                         </div>
                         <div>
                            <div className="fw-bold text-dark mb-0 d-block lh-1 text-capitalize">{booking.user?.name || "Customer"}</div>
                            <div className="text-muted" style={{fontSize: "0.7rem"}}>{booking.user?.email || "-"}</div>
                         </div>
                      </div>
                    </td>
                    <td className="border-0 text-center">
                       <div className="d-inline-flex align-items-center gap-2">
                          <BikeIcon size={14} className="text-primary" />
                          <span className="fw-medium text-dark">{booking.bike?.name || "Bike"}</span>
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
                        {getStatusBadge(booking.endDate)}
                    </td>
                    <td className="text-end pe-3 border-0">
                       <span className="text-success fw-bold fs-6">
                           Rs. {(booking.totalPrice || 0).toFixed(2)}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderBookings;
