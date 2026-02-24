import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BikeSlider from "../components/BikeSlider";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="fw-bold mb-3">
                Rent Bikes Easily Across Pakistan
              </h1>
              <p className="text-muted mb-4">
                Searching for a bike on rent is a problem for many people.
                RideRent connects local bike owners with riders in a simple and
                reliable way.
              </p>
              <button
                className="btn btn-success px-4"
                onClick={() => navigate("/bike")}
              >
                Browse Bikes
              </button>
            </Col>
            <Col md={6}>
              <img
                src="/images/a11.png"
                alt="Bike Rental"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Popular Bikes Section */}
      <section className="py-5">
        <Container>
          <div className="mb-4">
            <h3 className="fw-bold">Popular Bikes Available</h3>
            <p className="text-muted">
              Explore commonly rented bikes from different cities in Pakistan.
            </p>
          </div>

          <BikeSlider />

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-success px-4"
              onClick={() => navigate("/bike")}
            >
              View All Bikes
            </button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;