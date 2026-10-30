import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Spinner, Alert } from "react-bootstrap";
import { getBikeById, resolveBikeImageUrl, addReview } from "../../services/bikeService";
import { createBooking } from "../../services/bookingService";
import { getStoredUser } from "../../services/authService";
import { Calendar, MapPin, Shield, CheckCircle, Tag, Star } from "lucide-react";
import { confirmAction, showInfo, showSuccess } from "../../utils/alerts";

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState({ type: "", text: "" });
  const user = getStoredUser();

  const fetchBike = async () => {
    try {
      const res = await getBikeById(id);
      setBike(res.data);
    } catch {
      setError("Failed to load bike details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBike();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg({ type: "", text: "" });
    try {
      await addReview(id, review);
      setReview({ rating: 5, comment: "" });
      setReviewMsg({ type: "success", text: "Thank you! Your review has been added." });
      fetchBike();
    } catch (err) {
      setReviewMsg({ type: "danger", text: err.response?.data?.message || "Could not add review." });
    }
  };

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
      const goLogin = await confirmAction({
        title: "Login required",
        text: "Please log in or create an account to book this bike.",
        confirmText: "Go to login",
      });
      if (goLogin) navigate("/login");
      return;
    }
    if (user.role !== "user") {
      return showInfo("Customers only", "Only customer accounts can book bikes.");
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
      await showSuccess("Request sent", "The owner will accept or reject your request. Track it in your dashboard.");
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
              {bike.category && (
                 <span className="badge bg-dark bg-opacity-75 mb-2 ms-2 px-3 py-2 rounded-pill">{bike.category}</span>
              )}
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
                 style={{maxHeight: "450px", objectFit: bike.image?.startsWith("/uploads/demo") ? "contain" : "cover"}}
                 onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src = "https://placehold.co/800x500?text=No+Image";
                 }}
              />
           </div>
           
           <h4 className="fw-bold border-bottom pb-2 mb-3">Vehicle Details</h4>
           <p className="text-muted lh-lg" style={{ whiteSpace: "pre-wrap" }}>
               {bike.description ||
                 `This ${bike.brand} bike is available in ${bike.city}. Suitable for city commuting and daily rides, and maintained by a verified RideRent provider.`}
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
                          <p className="fw-bold mb-0">Verified Provider</p>
                      </div>
                  </div>
               </Col>
           </Row>

           {/* Reviews */}
           <h4 className="fw-bold border-bottom pb-2 mb-3 mt-5">
              Reviews <span className="text-muted fs-6 fw-normal">({bike.numReviews || 0})</span>
           </h4>
           {(bike.reviews || []).length === 0 ? (
              <p className="text-muted">No reviews yet. Renters can review a bike after booking it.</p>
           ) : (
              bike.reviews.slice().reverse().map((r) => (
                 <div key={r._id} className="border rounded p-3 mb-2 bg-light">
                    <div className="d-flex justify-content-between">
                       <span className="fw-semibold">{r.name}</span>
                       <span className="text-warning">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <p className="mb-0 small text-muted mt-1">{r.comment}</p>
                 </div>
              ))
           )}

           {user?.role === "user" && (
              <Form onSubmit={handleReview} className="border rounded p-3 mt-3">
                 <h6 className="fw-bold d-flex align-items-center gap-2"><Star size={16} className="text-warning" /> Write a review</h6>
                 {reviewMsg.text && <Alert variant={reviewMsg.type} className="py-2 small">{reviewMsg.text}</Alert>}
                 <Row className="g-2">
                    <Col sm={3}>
                       <Form.Select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                       </Form.Select>
                    </Col>
                    <Col sm={9}>
                       <Form.Control
                          placeholder="How was your ride?"
                          value={review.comment}
                          onChange={(e) => setReview({ ...review, comment: e.target.value })}
                          required
                       />
                    </Col>
                 </Row>
                 <Button type="submit" variant="outline-success" size="sm" className="mt-2">Submit Review</Button>
              </Form>
           )}
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
             {bike.isAvailable === false && (
                <Alert variant="warning" className="border-0 shadow-sm">This bike is currently unavailable for rent.</Alert>
             )}
             
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
                   disabled={bookingLoading || bike.isAvailable === false}
                >
                   {bookingLoading ? <Spinner animation="border" size="sm" /> : "Request to Book"}
                </Button>
                
                <p className="text-center text-muted small mt-3 mb-0">
                    You won't be charged yet. The owner will accept or reject your request.
                </p>
             </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BikeDetails;
