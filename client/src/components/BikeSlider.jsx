import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { getAllBikes, resolveBikeImageUrl } from "../services/bikeService";
import { Spinner } from "react-bootstrap";
import { MapPin } from "lucide-react";

const BikeSlider = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await getAllBikes();
        // Home page shows the 10 best-rated bikes
        const topRated = (res.data || [])
          .slice()
          .sort((a, b) => (b.numReviews ? b.rating : 0) - (a.numReviews ? a.rating : 0) || (b.numReviews || 0) - (a.numReviews || 0))
          .slice(0, 10);
        setBikes(topRated);
      } catch (error) {
        console.error("Error fetching bikes for slider", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const settings = {
    dots: false,
    infinite: bikes.length > 3,
    speed: 600,
    slidesToShow: bikes.length >= 4 ? 4 : bikes.length,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(bikes.length, 3) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(bikes.length, 2) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="text-center py-4 bg-light rounded text-muted">
        <p className="mb-0">No bikes currently available.</p>
      </div>
    );
  }

  return (
    <Slider {...settings}>
      {bikes.map((bike) => (
        <div key={bike._id} className="px-2 pb-3">
          <div
            className="bg-white rounded shadow-sm h-100 transition-all d-flex flex-column"
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onClick={() => navigate(`/bike/${bike._id}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <img
              src={resolveBikeImageUrl(bike.image)}
              alt={bike.name}
              className="img-fluid rounded-top w-100"
              style={{ height: "180px", objectFit: bike.image?.startsWith("/uploads/demo") ? "contain" : "cover", background: "#f8f9fa" }}
              onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/400x300?text=No+Image";
              }}
            />
            <div className="p-3 d-flex flex-column flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-1">
                 <h6 className="fw-semibold mb-0 text-dark">{bike.name}</h6>
                 <span className="badge bg-light text-dark border" style={{fontSize: "0.7rem"}}>{bike.brand}</span>
              </div>
              <p className="small text-muted mb-auto d-flex align-items-center gap-1">
                 <MapPin size={12} className="text-danger" /> {bike.city || "Unknown City"}
              </p>
              <hr className="my-2 border-light" />
              <p className="fw-bold text-success mb-0 fs-5 mt-1">
                Rs. {bike.rentPerDay.toLocaleString()} <span className="small text-muted fw-normal fs-6">/ day</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BikeSlider;