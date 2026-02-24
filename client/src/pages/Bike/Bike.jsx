import { Container, Row, Col, Form } from "react-bootstrap";
import bikes from "../../data/bikes";
import { useNavigate } from "react-router-dom";

const Bike = () => {
  const navigate = useNavigate();

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
          <div className="border rounded p-3 sticky-top" style={{ top: "100px" }}>
            <h6 className="fw-semibold mb-3">Filters</h6>

            {/* Location */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Location</Form.Label>
              <Form.Select>
                <option>All Cities</option>
                <option>Lahore</option>
                <option>Karachi</option>
                <option>Islamabad</option>
                <option>Faisalabad</option>
              </Form.Select>
            </Form.Group>

            {/* Price Range */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">
                Price per Day
              </Form.Label>
              <Form.Range />
              <div className="d-flex justify-content-between small text-muted">
                <span>Rs. 500</span>
                <span>Rs. 3000</span>
              </div>
            </Form.Group>

            {/* Bike Type */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Bike Type</Form.Label>
              {["70cc", "100cc", "125cc", "150cc+"].map((type) => (
                <Form.Check
                  key={type}
                  type="checkbox"
                  label={type}
                  className="small"
                />
              ))}
            </Form.Group>

            {/* Availability */}
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Availability
              </Form.Label>
              <Form.Check
                type="radio"
                label="Available Now"
                name="availability"
                className="small"
              />
              <Form.Check
                type="radio"
                label="Any Time"
                name="availability"
                className="small"
              />
            </Form.Group>
          </div>
        </Col>

        {/* Bikes Grid */}
        <Col md={9}>
          <Row>
            {bikes.map((bike) => (
              <Col md={4} key={bike.id} className="mb-4">
                <div
                  className="bg-white rounded shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/bike/${bike.id}`)}
                >
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="img-fluid rounded-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="p-3">
                    <h6 className="fw-semibold mb-1">{bike.name}</h6>
                    <p className="small text-muted mb-1">{bike.city}</p>
                    <p className="fw-bold text-success mb-0">
                      Rs. {bike.price} / day
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Bike;