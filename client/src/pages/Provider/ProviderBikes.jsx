import React, { useEffect, useMemo, useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { getMyBikes, deleteBike, updateBike, resolveBikeImageUrl } from "../../services/bikeService";
import api from "../../api/axios";
import { Table, Button, Badge, Spinner, Image, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { Trash2, Edit, Bike as BikeIcon, MapPin, Tag, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BIKE_CATEGORIES } from "../../constants/bikeCategories";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { confirmAction, showSuccess, showError, apiError } from "../../utils/alerts";

const ProviderBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMyBikes = async () => {
    setLoading(true);
    try {
      const res = await getMyBikes();
      setBikes(res.data);
    } catch (err) {
      console.error("Error fetching my bikes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBikes();
  }, []);

  const sortedBikes = useMemo(() => [...bikes].sort((a, b) => a.name.localeCompare(b.name)), [bikes]);
  const pagination = usePagination(sortedBikes, 8);

  const handleDelete = async (bike) => {
    const ok = await confirmAction({
      title: `Remove ${bike.name}?`,
      text: "It will be removed from your fleet and from search.",
      confirmText: "Remove",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteBike(bike._id);
      showSuccess("Bike removed");
      fetchMyBikes();
    } catch (err) {
      showError(apiError(err, "Failed to delete bike"));
    }
  };

  const toggleAvailability = async (bike) => {
    try {
      await updateBike(bike._id, { isAvailable: bike.isAvailable === false });
      fetchMyBikes();
    } catch (err) {
      showError(apiError(err, "Failed to update availability"));
    }
  };

  const openEdit = (bike) => {
    setEditing(bike);
    setForm({
      name: bike.name,
      brand: bike.brand,
      city: bike.city,
      rentPerDay: bike.rentPerDay,
      category: bike.category || "",
      description: bike.description || "",
    });
    setImageFile(null);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let image;
      // Upload a new photo only if one was chosen
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        image = uploadRes.data;
      }

      await updateBike(editing._id, { ...form, rentPerDay: Number(form.rentPerDay), image });
      setEditing(null);
      showSuccess("Bike updated");
      fetchMyBikes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Fleet</h3>
          <p className="text-muted small mb-0">Edit your bikes and switch them available or unavailable for rent</p>
        </div>
        <Button
          as={Link}
          to="/provider/add-bike"
          variant="success"
          className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
        >
          <PlusCircle size={18} /> Add New Bike
        </Button>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <BikeIcon size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-3">You haven't added any bikes yet.</p>
            <Button as={Link} to="/provider/add-bike" variant="outline-success" size="sm" className="rounded-pill px-4">
              Get Started
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase fw-bold">
                <tr className="border-bottom">
                  <th className="py-3 ps-3 border-0">Bike Info</th>
                  <th className="py-3 border-0">Brand</th>
                  <th className="py-3 border-0 text-center">Rent/Day</th>
                  <th className="py-3 border-0 text-center">Rating</th>
                  <th className="py-3 border-0 text-center">Available</th>
                  <th className="py-3 pe-3 border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((bike) => (
                  <tr key={bike._id} className="border-bottom">
                    <td className="ps-3 py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <Image
                          src={resolveBikeImageUrl(bike.image)}
                          className="rounded shadow-sm border"
                          style={{ width: "60px", height: "45px", objectFit: bike.image?.startsWith("/uploads/demo") ? "contain" : "cover" }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{bike.name}</div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <MapPin size={12} /> {bike.city || "Various Location"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-0">
                      <Badge bg="light" className="text-dark border px-2 py-1 fw-medium text-uppercase" style={{ fontSize: "0.7rem" }}>
                        <Tag size={10} className="me-1" /> {bike.brand}
                      </Badge>
                    </td>
                    <td className="text-center border-0 text-success fw-bold">Rs. {bike.rentPerDay}</td>
                    <td className="text-center border-0">
                      <Badge bg="warning" className="text-dark px-2">
                        ★ {bike.rating ? bike.rating.toFixed(1) : "0.0"} ({bike.numReviews || 0})
                      </Badge>
                    </td>
                    <td className="text-center border-0">
                      <Form.Check
                        type="switch"
                        id={`available-${bike._id}`}
                        className="d-inline-block"
                        checked={bike.isAvailable !== false}
                        onChange={() => toggleAvailability(bike)}
                        label={bike.isAvailable === false ? "Off" : "On"}
                      />
                    </td>
                    <td className="text-end pe-3 border-0">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="link" className="text-secondary p-2" title="Edit" onClick={() => openEdit(bike)}>
                          <Edit size={18} />
                        </Button>
                        <Button variant="link" className="text-danger p-2" title="Delete" onClick={() => handleDelete(bike)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <TablePagination pagination={pagination} label="bikes" />
      </div>

      <Modal show={!!editing} onHide={() => setEditing(null)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Edit Bike</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control value={form.brand || ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rent per day (Rs.)</Form.Label>
                  <Form.Control type="number" min="1" value={form.rentPerDay || ""} onChange={(e) => setForm({ ...form, rentPerDay: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bike type</Form.Label>
                  <Form.Select value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Not set</option>
                    {BIKE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>New photo (optional)</Form.Label>
              <Form.Control type="file" accept="image/png,image/jpeg" onChange={(e) => setImageFile(e.target.files[0] || null)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ProviderLayout>
  );
};

export default ProviderBikes;
