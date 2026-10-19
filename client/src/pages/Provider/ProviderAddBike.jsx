import React, { useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { addBike } from "../../services/bikeService";
import api from "../../api/axios";
import { Form, Button, Row, Col, Card, Alert, Spinner, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Upload, Save, X, Bike as BikeIcon, MapPin, Tag, Info } from "lucide-react";

const ProviderAddBike = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    city: "",
    rentPerDay: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      // 1. Upload image if exists
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data; // Server returns /uploads/filename
      } else {
         setError("Please upload an image for the bike.");
         setLoading(false);
         return;
      }

      // 2. Create bike
      await addBike({
        ...formData,
        image: imageUrl,
        rentPerDay: Number(formData.rentPerDay),
      });

      navigate("/provider/my-bikes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add bike. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Add New Vehicle</h3>
        <p className="text-muted small">List a new bike for rental on the platform</p>
      </div>

      {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Vehicle Details</h5>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium d-flex align-items-center gap-2">
                  <BikeIcon size={16} className="text-success" /> Vehicle Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="e.g. Honda CD 70"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 py-2 shadow-none"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2">
                      <Tag size={16} className="text-success" /> Brand
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      placeholder="e.g. Honda, Yamaha, Suzuki"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="bg-light border-0 py-2 shadow-none"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-success" /> Location / City
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="e.g. Lahore, Karachi"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="bg-light border-0 py-2 shadow-none"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium d-flex align-items-center gap-2">
                  <span className="text-success fw-bold">Rs.</span> Rent Per Day (PKR)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="rentPerDay"
                  placeholder="e.g. 1500"
                  value={formData.rentPerDay}
                  onChange={handleChange}
                  required
                  min="1"
                  className="bg-light border-0 py-2 shadow-none"
                />
              </Form.Group>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Vehicle Image</h5>
              
              <div className="mb-3">
                {imagePreview ? (
                  <div className="position-relative group mb-3">
                    <Image 
                      src={imagePreview} 
                      className="w-100 rounded shadow-sm border" 
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="position-absolute top-0 end-0 m-2 rounded-circle border-0 shadow"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <label 
                    className="d-flex flex-column align-items-center justify-content-center w-100 rounded border-2 border-dashed bg-light hover-bg-light transition-all mb-3 text-center"
                    style={{ height: "200px", cursor: "pointer", borderColor: "#dee2e6" }}
                  >
                    <Upload size={32} className="text-muted mb-2" />
                    <span className="text-secondary small fw-medium">Click to upload bike image</span>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                  </label>
                )}
              </div>

              <div className="alert alert-light border-0 small text-muted mb-4 shadow-sm">
                <Info size={14} className="me-2 text-info" />
                Upload a clear image of the bike from the side.
              </div>

              <div className="mt-auto d-grid">
                <Button 
                  type="submit" 
                  variant="success" 
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill shadow-sm"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : <Save size={18} />}
                  {loading ? "Adding Vehicle..." : "Save Vehicle"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </ProviderLayout>
  );
};

export default ProviderAddBike;
