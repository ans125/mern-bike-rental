import React, { useEffect, useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { getMyBikes, deleteBike, resolveBikeImageUrl } from "../../services/bikeService";
import { Table, Button, Badge, Spinner, Image } from "react-bootstrap";
import { Trash2, Edit, Bike as BikeIcon, MapPin, Tag, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ProviderBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bike from your fleet?")) {
      try {
        await deleteBike(id);
        fetchMyBikes();
      } catch (err) {
        alert("Failed to delete bike");
      }
    }
  };

  return (
    <ProviderLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Fleet</h3>
          <p className="text-muted small mb-0">Manage your rental inventory</p>
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
                            <MapPin size={12} /> {bike.city || "Various Location"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-0">
                       <Badge bg="light" className="text-dark border px-2 py-1 fw-medium text-uppercase" style={{fontSize: "0.7rem"}}>
                          <Tag size={10} className="me-1" /> {bike.brand}
                       </Badge>
                    </td>
                    <td className="text-center border-0 text-success fw-bold">
                       Rs. {bike.rentPerDay}
                    </td>
                    <td className="text-center border-0">
                       <Badge bg="warning" className="text-dark px-2">
                          ★ {bike.rating ? bike.rating.toFixed(1) : "0.0"}
                       </Badge>
                    </td>
                    <td className="text-end pe-3 border-0">
                       <div className="d-flex justify-content-end gap-1">
                          <Button 
                            variant="link" 
                            className="text-secondary p-2 hover-bg-light rounded-circle border-0 transition-all"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="text-danger p-2 hover-bg-danger-light rounded-circle border-0 transition-all"
                            onClick={() => handleDelete(bike._id)}
                            title="Delete"
                          >
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
      </div>
    </ProviderLayout>
  );
};

export default ProviderBikes;
