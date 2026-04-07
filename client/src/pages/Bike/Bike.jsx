import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllBikes, resolveBikeImageUrl } from "../../services/bikeService";

const Bike = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [location, setLocation] = useState("All Cities");
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await getAllBikes();
        setBikes(res.data || []);
      } catch (err) {
        console.error("Error fetching bikes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  // Compute unique brands from the loaded bikes
  const availableBrands = [...new Set(bikes.map((b) => b.brand))].filter(Boolean);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // Filter Logic
  const filteredBikes = bikes.filter((bike) => {
    // Location Filter
    if (location !== "All Cities" && bike.city !== location) {
      return false;
    }
    // Price Filter
    if (bike.rentPerDay > priceRange) {
      return false;
    }
    // Brand Filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) {
      return false;
    }
    return true;
  });

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Browse Bikes</h2>
        <p className="text-muted">
          Explore available bikes for rent across Pakistan
        </p>
      </div>

      <Row>
        {/* Filters Panel */}
        <Col md={3}>
          <div className="border rounded p-3 sticky-top bg-white" style={{ top: "100px", zIndex: 10 }}>
            <h6 className="fw-semibold mb-3">Filters</h6>

            {/* Location */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Location</Form.Label>
              <Form.Select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>All Cities</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
                <option>Faisalabad</option>
              </Form.Select>
            </Form.Group>

            {/* Price Range */}
            <Form.Group className="mb-3">
               <Form.Label className="small fw-semibold d-flex justify-content-between">
                  <span>Max Rent / Day</span>
                  <span className="text-success fw-bold">Rs. {priceRange}</span>
               </Form.Label>
               <Form.Range 
                  min={100} 
                  max={10000} 
                  step={100}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
               />
               <div className="d-flex justify-content-between small text-muted">
                  <span>Rs. 100</span>
                  <span>Rs. 10,000+</span>
               </div>
            </Form.Group>

            {/* Brand Filter (Dynamic) */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Brands / Models</Form.Label>
              {availableBrands.length === 0 && <div className="small text-muted">No brands found</div>}
              {availableBrands.map((brand) => (
                <Form.Check
                  key={brand}
                  type="checkbox"
                  label={brand}
                  className="small text-capitalize"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
              ))}
            </Form.Group>

          </div>
        </Col>

        {/* Bikes Grid */}
        <Col md={9}>
          {loading ? (
             <div className="text-center py-5">
               <Spinner animation="border" variant="success" />
             </div>
          ) : filteredBikes.length === 0 ? (
             <div className="text-center py-5 bg-light rounded text-muted">
               <h5 className="fw-medium">No bikes found</h5>
               <p className="mb-0">Try adjusting your filters to see more results.</p>
             </div>
          ) : (
            <Row>
              {filteredBikes.map((bike) => (
                <Col md={4} key={bike._id} className="mb-4">
                  <div
                    className="bg-white rounded shadow-sm h-100 transition-all hover-translate-y d-flex flex-column"
                    style={{ cursor: "pointer", transition: "transform 0.2s ease-in-out" }}
                    onClick={() => navigate(`/bike/${bike._id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <img
                      src={resolveBikeImageUrl(bike.image)}
                      alt={bike.name}
                      className="img-fluid rounded-top w-100"
                      style={{ height: "180px", objectFit: "cover" }}
                      onError={(e) => {
                         e.target.onerror = null; 
                         e.target.src = "https://placehold.co/400x300?text=No+Image";
                      }}
                    />
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold mb-0 text-dark">{bike.name}</h6>
                        <span className="badge bg-light text-dark border">{bike.brand}</span>
                      </div>
                      <p className="small text-muted mb-auto">
                         <i className="bi bi-geo-alt-fill text-danger me-1"></i> 
                         {bike.city || "Unknown"}
                      </p>
                      
                      <hr className="my-2" />
                      
                      <div className="d-flex justify-content-between align-items-center mt-1">
                         <span className="text-muted small">Rent Form</span>
                         <span className="fw-bold text-success fs-5">
                            Rs. {bike.rentPerDay} <span className="small text-muted fw-normal fs-6">/ day</span>
                         </span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Bike;