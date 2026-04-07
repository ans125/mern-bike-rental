import React from "react";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from "react-bootstrap";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto">
        {/* Top Navbar Placeholder */}
        <header className="bg-white border-bottom p-4 sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Admin Dashboard</h5>
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small">Administrator</span>
              <img 
                 src="https://ui-avatars.com/api/?name=Admin&background=198754&color=fff" 
                 alt="Admin Avatar" 
                 className="rounded-circle shadow-sm" 
                 width="40" 
                 height="40" 
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4">
          <div className="container-fluid bg-white rounded shadow-sm p-4 min-vh-85">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer position="top-end" className="p-3" />
    </div>
  );
};

export default AdminLayout;
