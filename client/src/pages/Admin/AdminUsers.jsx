import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getUsers, deleteUser } from "../../services/adminService";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import { Trash2, User as UserIcon } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">User Management</h3>
        <Badge bg="success" className="p-2 px-3">
          {users.length} Total Users
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle border-0 shadow-sm rounded">
            <thead className="bg-light">
              <tr className="border-0">
                <th className="py-3 ps-4 border-0 rounded-start">User</th>
                <th className="py-3 border-0">Email</th>
                <th className="py-3 border-0">Role</th>
                <th className="py-3 border-0 text-center">Status</th>
                <th className="py-3 pe-4 border-0 text-end rounded-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-bottom">
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: "40px", height: "40px", backgroundColor: "#19875415", color: "#198754" }}
                      >
                        <UserIcon size={18} />
                      </div>
                      <span className="fw-bold text-dark">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{user.email}</td>
                  <td>
                    <Badge 
                      bg="none"
                      className="text-capitalize px-3 py-2 border rounded-pill"
                      style={{ 
                        color: user.role === "admin" ? "#dc3545" : user.role === "provider" ? "#ffc107" : "#0dcaf0",
                        borderColor: user.role === "admin" ? "#dc3545" : user.role === "provider" ? "#ffc107" : "#0dcaf0"
                      }}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="text-center">
                    {user.role === "provider" ? (
                      <Badge 
                        bg={user.isApproved ? "success" : "warning"}
                        className="rounded-pill px-3"
                      >
                        {user.isApproved ? "Approved" : "Pending Approval"}
                      </Badge>
                    ) : (
                      <Badge bg="success" className="rounded-pill px-3">Verified</Badge>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <Button 
                      variant="link" 
                      className={`text-danger p-2 rounded-circle hover-bg-danger-light border-0 transition-all ${user.role === "admin" ? "opacity-0" : ""}`}
                      onClick={() => ! (user.role === "admin") && handleDelete(user._id)}
                      title="Delete User"
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
    </AdminLayout>
  );
};

export default AdminUsers;
