import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Spinner, Alert } from "react-bootstrap";
import { getBikeById, resolveBikeImageUrl } from "../../services/bikeService";
import { createBooking } from "../../services/bookingService";
import { getStoredUser } from "../../services/authService";
import { Calendar, MapPin, Shield, CheckCircle, Tag } from "lucide-react";

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);
        const res = await getBikeById(id);
        setBike(res.data);
      } catch {
        setError("Failed to load bike details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure accurate full day duration at midnight
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Booking same day counts as 1 day minimum
    return diffDays > 0 ? diffDays : 1; 
  };

  const days = calculateDays();
  const totalPrice = bike ? (days * bike.rentPerDay) : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    const user = getStoredUser();
    if (!user) {
      alert("You must be logged in to book a bike.");
      return navigate("/login");
    }

    if (!startDate || !endDate) {
      return setError("Please select both start and end dates.");
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        return setError("End date cannot be earlier than start date.");
    }

    try {
      setBookingLoading(true);
      await createBooking({ bikeId: id, startDate, endDate });
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book bike. It might be unavailable for these dates.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Get minimum date (Today)
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!bike) {
    return (
      <Container className="py-5 text-center">
         <h4 className="text-secondary">Bike not found.</h4>
         <Button variant="outline-success" onClick={() => navigate("/bike")}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="g-5">
        {/* Left Side - Bike Info & Images */}
        <Col lg={7}>
           <div className="mb-4">
              <span className="badge bg-success bg-opacity-10 text-success mb-2 px-3 py-2 rounded-pill">
                  {bike.brand}
              </span>
              <h1 className="fw-bold fs-2 mb-2">{bike.name}</h1>
              <div className="d-flex align-items-center gap-3 text-muted">
                 <span className="d-flex align-items-center gap-1">
                    <MapPin size={16}/> {bike.city || "Unknown Location"}
                 </span>
                 <span>•</span>
                 <span className="d-flex align-items-center gap-1">
                    <CheckCircle size={16} className="text-success"/> Verified Listing
                 </span>
              </div>
           </div>
           
           <div className="bg-light rounded overflow-hidden shadow-sm mb-4 border">
              <img 
                 src={resolveBikeImageUrl(bike.image)} 
                 alt={bike.name}
                 className="img-fluid w-100"
                 style={{maxHeight: "450px", objectFit: "cover"}}
                 onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src = "https://placehold.co/800x500?text=No+Image";
                 }}
              />
           </div>
           
           <h4 className="fw-bold border-bottom pb-2 mb-3">Vehicle Details</h4>
           <p className="text-muted lh-lg">
               This premium {bike.brand} vehicle is stationed in {bike.city}. Perfect for city commuting and smooth rides. Fully insured and regularly maintained by our vetted provider network to guarantee your safety and comfort throughout your rental period.
           </p>
           
           <Row className="g-3 mt-3">
               <Col sm={6}>
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded shadow-sm border border-white">
                      <Tag size={24} className="text-success" />
                      <div>
                          <p className="mb-0 small text-muted">Brand</p>
                          <p className="fw-bold mb-0 text-capitalize">{bike.brand}</p>
                      </div>
                  </div>
               </Col>
               <Col sm={6}>
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded shadow-sm border border-white">
                      <Shield size={24} className="text-success" />
                      <div>
                          <p className="mb-0 small text-muted">Protection</p>
                          <p className="fw-bold mb-0">Basic Insurance Included</p>
                      </div>
                  </div>
               </Col>
           </Row>
        </Col>

        {/* Right Side - Booking Form */}
        <Col lg={5}>
          <div className="bg-white border rounded shadow-sm p-4 sticky-top" style={{top: "100px"}}>
             <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4">
                 <div>
                    <span className="text-muted small">Rent Price</span>
                    <h3 className="fw-bold text-success mb-0 d-flex align-items-end gap-1">
                       Rs. {bike.rentPerDay} <span className="fs-6 text-muted fw-normal">/ day</span>
                    </h3>
                 </div>
                 <div className="text-warning fw-bold d-flex align-items-center gap-1">
                    ★ {bike.rating ? bike.rating.toFixed(1) : "New"}
                 </div>
             </div>
             
             {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}
             
             <Form onSubmit={handleBooking}>
                <Row className="g-3 mb-4">
                   <Col sm={6}>
                       <Form.Group>
                           <Form.Label className="small fw-semibold text-muted d-flex align-items-center gap-1">
                               <Calendar size={14}/> Pick-up Date
                           </Form.Label>
                           <Form.Control 
                              type="date" 
                              value={startDate}
                              min={today}
                              onChange={(e) => setStartDate(e.target.value)}
                              required
                              className="bg-light"
                           />
                       </Form.Group>
                   </Col>
                   <Col sm={6}>
                       <Form.Group>
                           <Form.Label className="small fw-semibold text-muted d-flex align-items-center gap-1">
                               <Calendar size={14}/> Drop-off Date
                           </Form.Label>
                           <Form.Control 
                              type="date" 
                              value={endDate}
                              min={startDate || today}
                              onChange={(e) => setEndDate(e.target.value)}
                              required
                              className="bg-light"
                           />
                       </Form.Group>
                   </Col>
                </Row>
                
                {startDate && endDate && days > 0 && (
                    <div className="bg-light p-3 rounded mb-4 border border-dashed border-success">
                        <div className="d-flex justify-content-between mb-2">
                           <span className="text-muted">Rs. {bike.rentPerDay} x {days} days</span>
                           <span className="fw-medium">Rs. {totalPrice}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                           <span className="text-muted">Service Fee</span>
                           <span className="fw-medium">Rs. 0</span>
                        </div>
                        <hr className="my-2 border-secondary" />
                        <div className="d-flex justify-content-between">
                           <span className="fw-bold">Total (PKR)</span>
                           <span className="fw-bold fs-5 text-success">Rs. {totalPrice}</span>
                        </div>
                    </div>
                )}
                
                <Button 
                   variant="success" 
                   type="submit" 
                   className="w-100 py-3 fw-bold rounded-pill shadow-sm"
                   disabled={bookingLoading}
                >
                   {bookingLoading ? <Spinner animation="border" size="sm" /> : "Request to Book"}
                </Button>
                
                <p className="text-center text-muted small mt-3 mb-0">
                    You won't be charged yet
                </p>
             </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BikeDetails;
