import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getPendingProviders, approveProvider, getUsers, deleteUser } from "../../services/adminService";
import { Table, Button, Badge, Spinner, Tabs, Tab } from "react-bootstrap";
import { CheckCircle, XCircle, User as UserIcon, Trash2 } from "lucide-react";

const AdminProviders = () => {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("pending");

  const fetchData = async () => {
    setLoading(true);
    try {
      const pendingRes = await getPendingProviders();
      const allRes = await getUsers();
      setPendingProviders(pendingRes.data);
      setAllProviders(allRes.data.filter(u => u.role === "provider" && u.isApproved));
    } catch (err) {
      console.error("Error fetching providers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm("Approve this provider?")) {
      try {
        await approveProvider(id);
        fetchData();
      } catch (err) {
        alert("Failed to approve provider");
      }
    }
  };

  const handleDelete = async (id) => {
    const msg = key === "pending" ? "Reject this provider request?" : "Remove this provider from the system?";
    if (window.confirm(msg)) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete provider");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Provider Control</h3>
          <p className="text-muted small mb-0">Manage and approve vehicle providers</p>
        </div>
        <div className="d-flex gap-2">
           <Badge bg="warning" className="p-2 px-3 text-dark rounded-pill border-0 shadow-sm">
             {pendingProviders.length} Pending
           </Badge>
           <Badge bg="success" className="p-2 px-3 rounded-pill border-0 shadow-sm">
             {allProviders.length} Approved
           </Badge>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Tabs
          id="provider-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4 custom-tabs border-bottom-0"
        >
          <Tab eventKey="pending" title={`Pending Approvals`}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
              </div>
            ) : pendingProviders.length === 0 ? (
              <div className="text-center py-5 border rounded bg-light">
                 <p className="text-muted mb-0">No pending provider requests found.</p>
              </div>
            ) : (
              <ProviderTable 
                providers={pendingProviders} 
                onApprove={handleApprove} 
                onDelete={handleDelete}
                isPending={true}
              />
            )}
          </Tab>
          <Tab eventKey="approved" title={`Active Providers`}>
            {loading ? (
               <div className="text-center py-5">
                 <Spinner animation="border" variant="success" />
               </div>
            ) : allProviders.length === 0 ? (
                <div className="text-center py-5 border rounded bg-light">
                    <p className="text-muted mb-0">No active providers found.</p>
                </div>
            ) : (
              <ProviderTable 
                providers={allProviders} 
                onDelete={handleDelete}
                isPending={false}
              />
            )}
          </Tab>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const ProviderTable = ({ providers, onApprove, onDelete, isPending }) => (
  <div className="table-responsive">
    <Table hover className="align-middle mb-0">
      <thead className="bg-light text-secondary small text-uppercase fw-bold">
        <tr className="border-bottom">
          <th className="py-3 ps-3 border-0">Provider</th>
          <th className="py-3 border-0">Email</th>
          <th className="py-3 border-0 text-center">Status</th>
          <th className="py-3 pe-3 border-0 text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {providers.map((p) => (
          <tr key={p._id} className="border-bottom transition-all">
            <td className="ps-3 py-3 border-0">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="rounded flex-shrink-0 d-flex align-items-center justify-content-center border-0 shadow-sm" 
                  style={{ width: "36px", height: "36px", backgroundColor: isPending ? "#ffc10715" : "#19875415", color: isPending ? "#ffc107" : "#198754" }}
                >
                  <UserIcon size={16} />
                </div>
                <div>
                   <div className="fw-bold text-dark">{p.name}</div>
                   <div className="text-muted" style={{ fontSize: "0.7rem" }}>ID: {p._id.slice(-8)}</div>
                </div>
              </div>
            </td>
            <td className="text-secondary small border-0">{p.email}</td>
            <td className="text-center border-0">
              <div 
                className={`badge rounded-pill border-0 ${isPending ? "bg-warning text-dark" : "bg-success"}`}
                style={{ padding: "0.4em 0.8em", minWidth: "75px" }}
              >
                {isPending ? "Waiting" : "Active"}
              </div>
            </td>
            <td className="text-end pe-3 border-0">
               <div className="d-flex justify-content-end gap-2">
                  {isPending ? (
                    <>
                        <Button 
                        variant="success" 
                        size="sm" 
                        className="d-flex align-items-center gap-1 rounded px-3 border-0 shadow-sm"
                        onClick={() => onApprove(p._id)}
                        >
                        <CheckCircle size={14} /> Approve
                        </Button>
                        <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="d-flex align-items-center gap-1 rounded px-3 border-0 shadow-sm"
                        onClick={() => onDelete(p._id)}
                        >
                        <XCircle size={14} /> Reject
                        </Button>
                    </>
                  ) : (
                    <Button 
                      variant="link" 
                      className="text-danger p-1 border-0 hover-light rounded-circle"
                      onClick={() => onDelete(p._id)}
                      title="Remove Provider"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
               </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default AdminProviders;



 
 
