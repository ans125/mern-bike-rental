import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Form, Spinner, Button, Badge, InputGroup } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { getAllBikes, resolveBikeImageUrl } from "../../services/bikeService";
import { BIKE_CATEGORIES } from "../../constants/bikeCategories";

const PAGE_SIZE = 12;

const SORTS = {
  recommended: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.numReviews || 0) - (a.numReviews || 0),
  priceLow: (a, b) => a.rentPerDay - b.rentPerDay,
  priceHigh: (a, b) => b.rentPerDay - a.rentPerDay,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
};

const Bike = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters (city and category can come from links like /bike?city=Lahore)
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(searchParams.get("city") || "All Cities");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [visible, setVisible] = useState(PAGE_SIZE);

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

  // Options are built from the loaded bikes, so new cities/brands appear automatically
  const cities = useMemo(() => [...new Set(bikes.map((b) => b.city).filter(Boolean))].sort(), [bikes]);
  const brands = useMemo(() => [...new Set(bikes.map((b) => b.brand).filter(Boolean))].sort(), [bikes]);
  const categories = useMemo(() => {
    const found = new Set(bikes.map((b) => b.category).filter(Boolean));
    return BIKE_CATEGORIES.filter((c) => found.has(c));
  }, [bikes]);
  const highestPrice = useMemo(() => Math.max(1000, ...bikes.map((b) => b.rentPerDay || 0)), [bikes]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  };

  const resetFilters = () => {
    setQuery("");
    setCity("All Cities");
    setCategory("All");
    setMaxPrice(10000);
    setSelectedBrands([]);
    setSort("recommended");
  };

  const filteredBikes = useMemo(() => {
    const text = query.trim().toLowerCase();
    return bikes
      .filter((bike) => {
        if (text && !`${bike.name} ${bike.brand}`.toLowerCase().includes(text)) return false;
        if (city !== "All Cities" && bike.city !== city) return false;
        if (category !== "All" && bike.category !== category) return false;
        if (bike.rentPerDay > maxPrice) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) return false;
        return true;
      })
      .sort(SORTS[sort]);
  }, [bikes, query, city, category, maxPrice, selectedBrands, sort]);

  // Show the first page again whenever the filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, city, category, maxPrice, selectedBrands, sort]);

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Browse Bikes</h2>
        <p className="text-muted mb-0">
          Rent 70cc commuters, 125cc and 150cc bikes, sports bikes and electric bikes across Pakistan
        </p>
      </div>

      <Row className="g-4">
        {/* Filters Panel */}
        <Col lg={3}>
          <div className="border rounded p-3 bg-white sticky-lg-top" style={{ top: "100px", zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h6>
              <Button variant="link" size="sm" className="p-0 text-success" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">City</Form.Label>
              <Form.Select value={city} onChange={(e) => setCity(e.target.value)}>
                <option>All Cities</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Bike type</Form.Label>
              <div className="d-flex flex-wrap gap-1">
                {["All", ...categories].map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={category === c ? "success" : "outline-secondary"}
                    className="rounded-pill"
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold d-flex justify-content-between">
                <span>Max Rent / Day</span>
                <span className="text-success fw-bold">Rs. {maxPrice.toLocaleString()}</span>
              </Form.Label>
              <Form.Range
                min={500}
                max={Math.ceil(highestPrice / 500) * 500}
                step={100}
                value={Math.min(maxPrice, Math.ceil(highestPrice / 500) * 500)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="small fw-semibold">Brands</Form.Label>
              <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                {brands.length === 0 && <div className="small text-muted">No brands found</div>}
                {brands.map((brand) => (
                  <Form.Check
                    key={brand}
                    id={`brand-${brand}`}
                    type="checkbox"
                    label={`${brand} (${bikes.filter((b) => b.brand === brand).length})`}
                    className="small"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                ))}
              </div>
            </Form.Group>
          </div>
        </Col>

        {/* Results */}
        <Col lg={9}>
          <Row className="g-2 mb-3 align-items-center">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white"><Search size={16} /></InputGroup.Text>
                <Form.Control
                  placeholder="Search e.g. CD 70, YBR, GS 150"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={5}>
              <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort bikes">
                <option value="recommended">Sort: Top rated</option>
                <option value="priceLow">Sort: Price low to high</option>
                <option value="priceHigh">Sort: Price high to low</option>
                <option value="newest">Sort: Newest</option>
              </Form.Select>
            </Col>
          </Row>

          {!loading && (
            <p className="small text-muted mb-3">
              Showing {Math.min(visible, filteredBikes.length)} of {filteredBikes.length} bikes
              {city !== "All Cities" && ` in ${city}`}
            </p>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : filteredBikes.length === 0 ? (
            <div className="text-center py-5 bg-light rounded text-muted">
              <h5 className="fw-medium">No bikes found</h5>
              <p className="mb-3">Try another city, type or price.</p>
              <Button variant="outline-success" size="sm" onClick={resetFilters}>Reset filters</Button>
            </div>
          ) : (
            <>
              <Row className="g-4">
                {filteredBikes.slice(0, visible).map((bike) => (
                  <Col sm={6} xl={4} key={bike._id}>
                    <div
                      className="bg-white rounded shadow-sm h-100 d-flex flex-column border"
                      role="button"
                      tabIndex={0}
                      style={{ cursor: "pointer", transition: "transform 0.2s ease-in-out" }}
                      onClick={() => navigate(`/bike/${bike._id}`)}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/bike/${bike._id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div className="position-relative bg-light rounded-top overflow-hidden">
                        <img
                          src={resolveBikeImageUrl(bike.image)}
                          alt={bike.name}
                          loading="lazy"
                          className="w-100"
                          style={{ height: "180px", objectFit: bike.image?.startsWith("/uploads/demo") ? "contain" : "cover" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x300?text=No+Image";
                          }}
                        />
                        {bike.category && (
                          <Badge bg="dark" className="position-absolute top-0 start-0 m-2 bg-opacity-75">
                            {bike.category}
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                          <h6 className="fw-bold mb-0 text-dark">{bike.name}</h6>
                          <span className="small text-warning fw-semibold d-flex align-items-center gap-1 flex-shrink-0">
                            <Star size={14} fill="currentColor" />
                            {bike.numReviews ? `${bike.rating.toFixed(1)} (${bike.numReviews})` : "New"}
                          </span>
                        </div>
                        <p className="small text-muted mb-auto d-flex align-items-center gap-1">
                          <MapPin size={14} className="text-danger" /> {bike.city || "Unknown"}
                          <span className="mx-1">·</span> {bike.brand}
                        </p>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted small">Rent from</span>
                          <span className="fw-bold text-success fs-5">
                            Rs. {bike.rentPerDay.toLocaleString()}
                            <span className="small text-muted fw-normal fs-6"> / day</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {visible < filteredBikes.length && (
                <div className="text-center mt-4">
                  <Button variant="outline-success" className="px-4" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more bikes ({filteredBikes.length - visible} more)
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Bike;
