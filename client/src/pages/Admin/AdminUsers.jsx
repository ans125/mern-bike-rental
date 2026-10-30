import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { getUsers, deleteUser } from "../../services/adminService";
import { confirmAction, showSuccess, showError, apiError } from "../../utils/alerts";
import { Table, Button, Badge, Spinner, Form, Row, Col } from "react-bootstrap";
import { Trash2, User as UserIcon } from "lucide-react";

const ROLE_STYLE = {
  admin: { bg: "danger", label: "Admin" },
  provider: { bg: "primary", label: "Provider" },
  user: { bg: "secondary", label: "Customer" },
};

const verificationBadge = (user) => {
  if (user.role === "admin") return <Badge bg="dark" className="rounded-pill px-3">Admin</Badge>;
  if (user.isApproved) return <Badge bg="success" className="rounded-pill px-3">Verified</Badge>;
  if (user.verificationStatus === "rejected") return <Badge bg="danger" className="rounded-pill px-3">Rejected</Badge>;
  return <Badge bg="warning" text="dark" className="rounded-pill px-3">Pending</Badge>;
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("all");
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      showError(apiError(err, "Could not load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return users.filter(
      (u) => (role === "all" || u.role === role) && (!text || `${u.name} ${u.email} ${u.city} ${u.phone}`.toLowerCase().includes(text))
    );
  }, [users, role, query]);
  const pagination = usePagination(filtered, 12);

  const handleDelete = async (user) => {
    const ok = await confirmAction({
      title: `Delete ${user.name}?`,
      text: user.role === "provider" ? "Their bikes will also be removed. This cannot be undone." : "This cannot be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteUser(user._id);
      showSuccess("User deleted");
      fetchUsers();
    } catch (err) {
      showError(apiError(err, "Failed to delete user"));
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">User Management</h3>
          <p className="text-muted small mb-0">All customers, providers and admins</p>
        </div>
        <Badge bg="success" className="p-2 px-3 rounded-pill">{users.length} Total Users</Badge>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
              <option value="all">All roles</option>
              <option value="user">Customers</option>
              <option value="provider">Providers</option>
              <option value="admin">Admins</option>
            </Form.Select>
          </Col>
          <Col md={8}>
            <Form.Control placeholder="Search name, email, phone or city" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light small text-uppercase text-secondary">
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Contact</th>
                  <th className="border-0">Role</th>
                  <th className="border-0 text-center">Verification</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px", backgroundColor: "#19875415", color: "#198754" }}>
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.name}</div>
                          <div className="small text-muted">{user.shopName || user.city || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small">
                      <div>{user.email}</div>
                      <div className="text-muted">{user.phone}</div>
                    </td>
                    <td><Badge bg={ROLE_STYLE[user.role]?.bg}>{ROLE_STYLE[user.role]?.label}</Badge></td>
                    <td className="text-center">{verificationBadge(user)}</td>
                    <td className="text-end">
                      {user.role !== "admin" && (
                        <Button variant="link" className="text-danger p-2" onClick={() => handleDelete(user)} title="Delete user">
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <TablePagination pagination={pagination} label="users" />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
