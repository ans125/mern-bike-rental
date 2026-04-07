import React from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { Alert, Row, Col, Card } from "react-bootstrap";
import { Info, Bike, CalendarCheck, Clock } from "lucide-react";

const ProviderDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <ProviderLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Welcome, {user.name}!</h3>
        <p className="text-muted">Overview of your rental operations.</p>
      </div>

      {!user.isApproved && (
        <Alert variant="warning" className="d-flex align-items-center gap-3 border-0 shadow-sm mb-4">
          <Clock className="flex-shrink-0" size={24} />
          <div>
            <Alert.Heading className="fs-5 fw-bold mb-1">Account Pending Approval</Alert.Heading>
            <p className="mb-0 small">
              Your provider account is currently under review by our administration. 
              You can still add bikes, but they will not be visible to users until you are approved.
            </p>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3">
             <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle p-3 bg-success bg-opacity-10 text-success">
                   <Bike size={24} />
                </div>
                <div>
                   <h6 className="text-secondary mb-0">Total Bikes</h6>
                   <h3 className="fw-bold mb-0">--</h3>
                </div>
             </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3">
             <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle p-3 bg-primary bg-opacity-10 text-primary">
                   <CalendarCheck size={24} />
                </div>
                <div>
                   <h6 className="text-secondary mb-0">Active Bookings</h6>
                   <h3 className="fw-bold mb-0">--</h3>
                </div>
             </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3">
             <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle p-3 bg-info bg-opacity-10 text-info">
                   <Info size={24} />
                </div>
                <div>
                   <h6 className="text-secondary mb-0">Account Status</h6>
                   <h6 className="fw-bold mb-0 text-uppercase small mt-1">
                      {user.isApproved ? "Approved" : "Pending"}
                   </h6>
                </div>
             </div>
          </Card>
        </Col>
      </Row>

      <div className="mt-5 p-5 border rounded text-center bg-light bg-opacity-50">
         <p className="text-muted small">Select a section from the sidebar to manage your fleet and bookings.</p>
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;

