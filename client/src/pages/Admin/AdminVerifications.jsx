import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { getVerifications, approveUser, rejectUser, getUserDocument, deleteUser } from "../../services/adminService";
import { confirmAction, askText, showSuccess, showError, apiError } from "../../utils/alerts";
import { Table, Button, Badge, Spinner, Tabs, Tab, Form, Row, Col, Modal } from "react-bootstrap";
import { CheckCircle, XCircle, Eye, Trash2, ShieldCheck } from "lucide-react";

const roleLabel = (role) => (role === "provider" ? "Provider" : "Customer");

// Loads one private CNIC image with the admin token and shows it
const DocumentImage = ({ userId, side, label }) => {
  const [url, setUrl] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl = "";
    getUserDocument(userId, side)
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setUrl(objectUrl);
      })
      .catch(() => setFailed(true));
    return () => objectUrl && URL.revokeObjectURL(objectUrl);
  }, [userId, side]);

  return (
    <div>
      <div className="small fw-semibold mb-1">{label}</div>
      {failed ? (
        <div className="border rounded p-4 text-center text-muted small">No document uploaded</div>
      ) : url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={label} className="img-fluid border rounded" />
        </a>
      ) : (
        <div className="border rounded p-4 text-center"><Spinner size="sm" /></div>
      )}
    </div>
  );
};

const AdminVerifications = () => {
  const [status, setStatus] = useState("pending");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVerifications(status);
      setAccounts(res.data);
    } catch (err) {
      showError(apiError(err, "Could not load accounts"));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return accounts.filter(
      (a) =>
        (roleFilter === "all" || a.role === roleFilter) &&
        (!text || `${a.name} ${a.email} ${a.cnic} ${a.city} ${a.shopName}`.toLowerCase().includes(text))
    );
  }, [accounts, roleFilter, query]);
  const pagination = usePagination(filtered, 10);

  const handleApprove = async (account) => {
    const ok = await confirmAction({
      title: `Approve ${account.name}?`,
      text: "Confirm that the CNIC images are clear and match the name and CNIC number.",
      confirmText: "Approve",
    });
    if (!ok) return;
    try {
      await approveUser(account._id);
      setSelected(null);
      showSuccess("Account approved");
      fetchAccounts();
    } catch (err) {
      showError(apiError(err, "Failed to approve"));
    }
  };

  const handleReject = async (account) => {
    const reason = await askText({
      title: `Reject ${account.name}?`,
      text: "The user will see this reason on their dashboard.",
      placeholder: "e.g. CNIC photo is blurry",
      confirmText: "Reject",
      inputType: "textarea",
      danger: true,
    });
    if (!reason) return;
    try {
      await rejectUser(account._id, reason);
      setSelected(null);
      showSuccess("Account rejected");
      fetchAccounts();
    } catch (err) {
      showError(apiError(err, "Failed to reject"));
    }
  };

  const handleDelete = async (account) => {
    const ok = await confirmAction({
      title: `Delete ${account.name}?`,
      text: account.role === "provider" ? "Their bikes will also be removed." : "This cannot be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteUser(account._id);
      showSuccess("Account deleted");
      fetchAccounts();
    } catch (err) {
      showError(apiError(err, "Failed to delete"));
    }
  };

  const table = (
    <>
      <Row className="g-2 mb-3">
        <Col md={4}>
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Role">
            <option value="all">All roles</option>
            <option value="user">Customers</option>
            <option value="provider">Providers</option>
          </Form.Select>
        </Col>
        <Col md={8}>
          <Form.Control placeholder="Search name, email, CNIC, city or shop" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light text-muted">No accounts here.</div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="bg-light text-secondary small text-uppercase">
              <tr>
                <th className="border-0">Name</th>
                <th className="border-0">Role</th>
                <th className="border-0">CNIC</th>
                <th className="border-0">City</th>
                <th className="border-0">Registered</th>
                <th className="border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div className="fw-bold">{a.name}</div>
                    <div className="small text-muted">{a.email}</div>
                  </td>
                  <td><Badge bg={a.role === "provider" ? "primary" : "secondary"}>{roleLabel(a.role)}</Badge></td>
                  <td className="font-monospace small">{a.cnic || "—"}</td>
                  <td>{a.city || "—"}</td>
                  <td className="small text-muted">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Button size="sm" variant="outline-primary" onClick={() => setSelected(a)}>
                        <Eye size={14} /> Review
                      </Button>
                      {status !== "approved" && (
                        <Button size="sm" variant="success" onClick={() => handleApprove(a)} title="Approve">
                          <CheckCircle size={14} />
                        </Button>
                      )}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a)} title="Delete">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <TablePagination pagination={pagination} label="accounts" />
    </>
  );

  return (
    <AdminLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-1 d-flex align-items-center gap-2"><ShieldCheck /> Account Verifications</h3>
        <p className="text-muted small mb-0">
          Check each customer's and provider's CNIC before approving. Customers can book and providers can list bikes only after approval.
        </p>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Tabs activeKey={status} onSelect={(k) => setStatus(k)} className="mb-4">
          <Tab eventKey="pending" title="Pending" />
          <Tab eventKey="approved" title="Approved" />
          <Tab eventKey="rejected" title="Rejected" />
        </Tabs>
        {table}
      </div>

      <Modal show={!!selected} onHide={() => setSelected(null)} size="lg" centered>
        {selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5 fw-bold">
                {selected.name} <Badge bg="secondary" className="ms-2">{roleLabel(selected.role)}</Badge>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table size="sm" borderless className="mb-3">
                <tbody>
                  <tr><th style={{ width: "34%" }}>Email</th><td>{selected.email}</td></tr>
                  <tr><th>Mobile</th><td>{selected.phone || "—"}</td></tr>
                  <tr><th>CNIC number</th><td className="font-monospace">{selected.cnic || "—"}</td></tr>
                  <tr><th>City</th><td>{selected.city || "—"}</td></tr>
                  {selected.role === "provider" && <tr><th>Shop name</th><td>{selected.shopName || "—"}</td></tr>}
                  <tr><th>{selected.role === "provider" ? "Shop address" : "Address"}</th><td>{selected.address || "—"}</td></tr>
                  {selected.role === "user" && <tr><th>Driving licence</th><td>{selected.licenseNumber || "—"}</td></tr>}
                  {selected.verificationNote && <tr><th>Rejection reason</th><td className="text-danger">{selected.verificationNote}</td></tr>}
                </tbody>
              </Table>
              <Row className="g-3">
                <Col md={6}><DocumentImage userId={selected._id} side="cnicFront" label="CNIC front" /></Col>
                <Col md={6}><DocumentImage userId={selected._id} side="cnicBack" label="CNIC back" /></Col>
              </Row>
              <div className="small text-muted mt-3">
                Check: photo is clear, name matches the account name, CNIC number matches, card is not expired.
              </div>
            </Modal.Body>
            <Modal.Footer>
              {status !== "rejected" && (
                <Button variant="outline-danger" onClick={() => handleReject(selected)}>
                  <XCircle size={16} className="me-1" /> Reject
                </Button>
              )}
              {status !== "approved" && (
                <Button variant="success" onClick={() => handleApprove(selected)}>
                  <CheckCircle size={16} className="me-1" /> Approve
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminVerifications;
