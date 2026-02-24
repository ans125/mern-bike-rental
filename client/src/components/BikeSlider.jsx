import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import bikes from "../data/bikes";

const BikeSlider = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {bikes.map((bike) => (
        <div key={bike.id} className="px-2">
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
        </div>
      ))}
    </Slider>
  );
};

export default BikeSlider;