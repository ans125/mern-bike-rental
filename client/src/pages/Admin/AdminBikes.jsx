import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAllBikes, deleteBike } from "../../services/adminService";
import { resolveBikeImageUrl } from "../../services/bikeService";
import { Table, Button, Badge, Spinner, Image } from "react-bootstrap";
import { Trash2, Bike as BikeIcon, MapPin, Tag } from "lucide-react";

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const res = await getAllBikes();
      setBikes(res.data);
    } catch (err) {
      console.error("Error fetching bikes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bike from the listing?")) {
      try {
        await deleteBike(id);
        fetchBikes();
      } catch {
        alert("Failed to delete bike");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Fleet Management</h3>
          <p className="text-muted small mb-0">Monitor and manage all bikes on the platform</p>
        </div>
        <Badge bg="success" className="p-2 px-3 rounded-pill shadow-sm">
          {bikes.length} Bikes Listed
        </Badge>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <BikeIcon size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No bikes found in the system.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase fw-bold">
                <tr className="border-bottom">
                  <th className="py-3 ps-3 border-0">Bike Details</th>
                  <th className="py-3 border-0">Brand / Model</th>
                  <th className="py-3 border-0">Provider</th>
                  <th className="py-3 border-0 text-center">Rent/Day</th>
                  <th className="py-3 pe-3 border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr key={bike._id} className="border-bottom transition-all">
                    <td className="ps-3 py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <Image 
                          src={resolveBikeImageUrl(bike.image)} 
                          className="rounded shadow-sm border"
                          style={{ width: "60px", height: "45px", objectFit: "cover" }}
                          fallback={<div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: "60px", height: "45px"}}><BikeIcon size={20} /></div>}
                        />
                        <div>
                          <div className="fw-bold text-dark">{bike.name}</div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <MapPin size={12} /> {bike.city || "Unknown City"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-0">
                       <Badge bg="light" className="text-dark border px-2 py-1 fw-medium text-uppercase" style={{fontSize: "0.7rem"}}>
                          <Tag size={10} className="me-1" /> {bike.brand}
                       </Badge>
                    </td>
                    <td className="text-secondary small border-0">
                       <div className="fw-medium text-dark">{bike.provider?.name || "Deleted User"}</div>
                       <div style={{fontSize: "0.7rem"}}>{bike.provider?.email}</div>
                    </td>
                    <td className="text-center border-0 text-success fw-bold">
                       Rs. {bike.rentPerDay}
                    </td>
                    <td className="text-end pe-3 border-0">
                       <Button 
                         variant="link" 
                         className="text-danger p-2 hover-bg-danger-light rounded-circle border-0 transition-all"
                         onClick={() => handleDelete(bike._id)}
                         title="Delete Bike"
                       >
                         <Trash2 size={18} />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBikes;
