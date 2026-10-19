import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Table } from "react-bootstrap";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import { User, Mail, Calendar, Bike, CheckCircle, Clock, XCircle } from "lucide-react";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
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

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        fetchBookings();
      } catch {
        alert("Failed to cancel booking");
      }
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Profile Side */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 text-center">
             <div className="mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=198754&color=fff`} 
                  alt="Avatar" 
                  className="rounded-circle shadow-sm" 
                  width="100" 
                />
             </div>
             <h4 className="fw-bold mb-1">{user.name}</h4>
             <p className="text-muted small mb-3 text-capitalize">{user.role}</p>
             
             <div className="text-start border-top pt-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                   <Mail size={16} className="text-success" />
                   <span className="small">{user.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                   <User size={16} className="text-success" />
                   <span className="small">Member since {new Date().getFullYear()}</span>
                </div>
             </div>
          </Card>
        </Col>

        {/* Bookings Side */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4">
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">My Rental History</h4>
                <Badge bg="success" className="rounded-pill px-3">{bookings.length} Bookings</Badge>
             </div>

             {loading ? (
                <div className="text-center py-5">
                   <Spinner animation="border" variant="success" />
                </div>
             ) : bookings.length === 0 ? (
                <div className="text-center py-5 bg-light rounded border border-dashed">
                   <Bike size={48} className="text-muted mb-3 opacity-25" />
                   <p className="text-muted">You haven't booked any bikes yet.</p>
                </div>
             ) : (
                <div className="table-responsive">
                   <Table hover className="align-middle border-0">
                      <thead className="bg-light small text-uppercase">
                         <tr className="border-0">
                            <th className="py-3 border-0">Vehicle</th>
                            <th className="py-3 border-0">Period</th>
                            <th className="py-3 border-0 text-center">Status</th>
                            <th className="py-3 border-0 text-end">Price</th>
                            <th className="py-3 border-0 text-end"></th>
                         </tr>
                      </thead>
                      <tbody>
                         {bookings.map((b) => (
                            <tr key={b._id} className="border-bottom">
                               <td className="py-3 border-0">
                                  <div className="fw-bold text-dark">{b.bike?.name || "Bike"}</div>
                                  <div className="small text-muted">{b.bike?.brand}</div>
                               </td>
                               <td className="border-0 small">
                                  <div className="d-flex align-items-center gap-1">
                                     <Calendar size={12} className="text-secondary" />
                                     {formatDate(b.startDate)}
                                  </div>
                               </td>
                               <td className="text-center border-0">
                                  {b.status === "cancelled" ? (
                                     <Badge bg="danger" className="rounded-pill">Cancelled</Badge>
                                  ) : (
                                     <Badge bg={new Date(b.endDate) < new Date() ? "secondary" : "success"} className="rounded-pill">
                                        {new Date(b.endDate) < new Date() ? "Completed" : "Scheduled"}
                                     </Badge>
                                  )}
                               </td>
                               <td className="text-end border-0 fw-bold text-success">
                                  Rs. {b.totalPrice?.toFixed(2)}
                               </td>
                               <td className="text-end border-0">
                                  {b.status !== "cancelled" && new Date(b.startDate) > new Date() && (
                                     <button 
                                       className="btn btn-link text-danger p-0 border-0"
                                       onClick={() => handleCancel(b._id)}
                                       title="Cancel Booking"
                                     >
                                        <XCircle size={18} />
                                     </button>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </Table>
                </div>
             )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;

