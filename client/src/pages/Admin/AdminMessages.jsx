import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getSupportMessages, updateSupportMessage } from "../../services/adminService";
import { Table, Badge, Spinner, Button, Form } from "react-bootstrap";
import { Inbox, CheckCircle, RotateCcw } from "lucide-react";
import TablePagination from "../../components/TablePagination";
import usePagination from "../../hooks/usePagination";
import { showSuccess, showError, apiError } from "../../utils/alerts";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("open");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getSupportMessages();
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching support messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateSupportMessage(id, status);
      showSuccess(status === "resolved" ? "Marked as resolved" : "Message reopened");
      fetchMessages();
    } catch (err) {
      showError(apiError(err, "Failed to update message"));
    }
  };

  const openCount = messages.filter((m) => m.status === "open").length;
  const filtered = useMemo(() => messages.filter((m) => status === "all" || m.status === status), [messages, status]);
  const pagination = usePagination(filtered, 8);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Support Messages</h3>
          <p className="text-muted small mb-0">Messages sent from the Contact page. Reply by email, then mark resolved.</p>
        </div>
        <Badge bg="warning" text="dark" className="p-2 px-3 rounded-pill">
          {openCount} Open
        </Badge>
      </div>

      <div className="bg-white rounded shadow-sm p-4 border border-light">
        <Form.Select className="mb-3" style={{ maxWidth: "220px" }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="all">All messages</option>
        </Form.Select>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <Inbox size={48} className="text-muted mb-3 opacity-25" />
            <p className="text-muted mb-0">No support messages yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-secondary small text-uppercase fw-bold">
                <tr>
                  <th className="py-3 ps-3 border-0">From</th>
                  <th className="py-3 border-0">Subject & Message</th>
                  <th className="py-3 border-0">Received</th>
                  <th className="py-3 border-0 text-center">Status</th>
                  <th className="py-3 pe-3 border-0 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((m) => (
                  <tr key={m._id}>
                    <td className="ps-3 py-3 border-0">
                      <div className="fw-bold">{m.name}</div>
                      <a href={`mailto:${m.email}`} className="small text-decoration-none">{m.email}</a>
                    </td>
                    <td className="border-0" style={{ maxWidth: "380px" }}>
                      <div className="fw-semibold">{m.subject}</div>
                      <div className="text-muted small" style={{ whiteSpace: "pre-wrap" }}>{m.message}</div>
                    </td>
                    <td className="border-0 small text-muted">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="border-0 text-center">
                      <Badge bg={m.status === "open" ? "warning" : "success"} text={m.status === "open" ? "dark" : undefined} className="rounded-pill px-3">
                        {m.status === "open" ? "Open" : "Resolved"}
                      </Badge>
                    </td>
                    <td className="border-0 text-end pe-3">
                      {m.status === "open" ? (
                        <Button size="sm" variant="outline-success" onClick={() => handleStatus(m._id, "resolved")}>
                          <CheckCircle size={14} className="me-1" /> Resolve
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline-secondary" onClick={() => handleStatus(m._id, "open")}>
                          <RotateCcw size={14} className="me-1" /> Reopen
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <TablePagination pagination={pagination} label="messages" />
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
