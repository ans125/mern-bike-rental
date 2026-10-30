import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { getAllBikes, deleteBike } from "../../services/adminService";
import { resolveBikeImageUrl } from "../../services/bikeService";
import { confirmAction, showSuccess, showError, apiError } from "../../utils/alerts";
import { Table, Button, Badge, Spinner, Image, Form, Row, Col } from "react-bootstrap";
import { Trash2, Bike as BikeIcon, MapPin } from "lucide-react";

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");

  const fetchBikes = async () => {
    try {
      const res = await getAllBikes();
      setBikes(res.data);
    } catch (err) {
      showError(apiError(err, "Could not load bikes"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const cities = useMemo(() => [...new Set(bikes.map((b) => b.city).filter(Boolean))].sort(), [bikes]);
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return bikes.filter(
      (b) =>
        (city === "all" || b.city === city) &&
        (!text || `${b.name} ${b.brand} ${b.provider?.name}`.toLowerCase().includes(text))
    );
  }, [bikes, city, query]);
  const pagination = usePagination(filtered, 10);

  const handleDelete = async (bike) => {
    const ok = await confirmAction({
      title: `Remove ${bike.name}?`,
      text: `Listed by ${bike.provider?.name || "unknown provider"} in ${bike.city}.`,
      confirmText: "Remove",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteBike(bike._id);
      showSuccess("Bike removed");
      fetchBikes();
    } catch (err) {
      showError(apiError(err, "Failed to delete bike"));
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Fleet Management</h3>
          <p className="text-muted small mb-0">Monitor and manage all bikes on the platform</p>
        </div>
        <Badge bg="success" className="p-2 px-3 rounded-pill shadow-sm">{bikes.length} Bikes Listed</Badge>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
              <option value="all">All cities</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Form.Select>
          </Col>
          <Col md={8}>
            <Form.Control placeholder="Search bike, brand or provider" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <BikeIcon size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No bikes found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase">
                <tr>
                  <th className="border-0">Bike</th>
                  <th className="border-0">Type</th>
                  <th className="border-0">Provider</th>
                  <th className="border-0 text-center">Rent/Day</th>
                  <th className="border-0 text-center">Status</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((bike) => (
                  <tr key={bike._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Image
                          src={resolveBikeImageUrl(bike.image)}
                          className="rounded border bg-light"
                          style={{ width: "60px", height: "45px", objectFit: bike.image?.startsWith("/uploads/demo") ? "contain" : "cover" }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{bike.name}</div>
                          <div className="text-muted small"><MapPin size={12} /> {bike.city || "Unknown"} · {bike.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small">{bike.category || "—"}</td>
                    <td className="small">
                      <div className="fw-medium text-dark">{bike.provider?.name || "Deleted user"}</div>
                      <div className="text-muted">{bike.provider?.email}</div>
                    </td>
                    <td className="text-center text-success fw-bold">Rs. {bike.rentPerDay?.toLocaleString()}</td>
                    <td className="text-center">
                      <Badge bg={bike.isAvailable === false ? "secondary" : "success"} className="rounded-pill">
                        {bike.isAvailable === false ? "Unavailable" : "Available"}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="link" className="text-danger p-2" onClick={() => handleDelete(bike)} title="Delete bike">
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <TablePagination pagination={pagination} label="bikes" />
      </div>
    </AdminLayout>
  );
};

export default AdminBikes;
