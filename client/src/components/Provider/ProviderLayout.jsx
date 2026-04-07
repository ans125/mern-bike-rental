import React from "react";
import ProviderSidebar from "./ProviderSidebar";
import { ToastContainer } from "react-bootstrap";

const ProviderLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto">
        <header className="bg-white border-bottom p-4 sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Provider Dashboard</h5>
            <div className="d-flex align-items-center gap-3">
               <div>
                  <div className="fw-bold text-dark lh-1 mb-1">{user.name}</div>
                  <div className="text-secondary small">Vehicle Provider</div>
               </div>
              <img 
                 src={`https://ui-avatars.com/api/?name=${user.name}&background=198754&color=fff`} 
                 alt="Provider Avatar" 
                 className="rounded shadow-sm" 
                 width="40" 
                 height="40" 
              />
            </div>
          </div>
        </header>

        <main className="p-4">
          <div className="container-fluid bg-white rounded shadow-sm p-4 min-vh-85 border border-light">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer position="top-end" className="p-3" />
    </div>
  );
};

export default ProviderLayout;
