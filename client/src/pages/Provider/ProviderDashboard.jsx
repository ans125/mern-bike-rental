import React, { useEffect, useState } from "react";
import ProviderLayout from "../../components/Provider/ProviderLayout";
import { Alert, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Info, Bike, CalendarCheck, Clock, Wallet, KeyRound, ShieldX } from "lucide-react";
import { getStoredUser, refreshStoredUser } from "../../services/authService";
import { getMyBikes } from "../../services/bikeService";
import { getProviderBookings } from "../../services/bookingService";

const ProviderDashboard = () => {
  const [user, setUser] = useState(getStoredUser() || {});
  const [stats, setStats] = useState({ bikes: "--", onRide: "--", toHandOver: "--", pending: "--", earnings: "--" });

  useEffect(() => {
    const load = async () => {
      try {
        const fresh = await refreshStoredUser();
        setUser(fresh || {});
        // Bike/booking APIs are blocked until the admin approves the provider
        if (!fresh?.isApproved) return;
        const [bikesRes, bookingsRes] = await Promise.all([getMyBikes(), getProviderBookings()]);
        const list = bookingsRes.data;
        // Earnings count every booking the provider accepted
        const earning = list.filter((b) => ["approved", "ongoing", "completed"].includes(b.status));
        setStats({
          bikes: bikesRes.data.length,
          onRide: list.filter((b) => b.status === "ongoing").length,
          toHandOver: list.filter((b) => b.status === "approved").length,
          pending: list.filter((b) => b.status === "pending").length,
          earnings: `Rs. ${earning.reduce((sum, b) => sum + (b.providerEarning || 0), 0).toLocaleString()}`,
        });
      } catch (err) {
        console.error("Error loading provider dashboard", err);
      }
    };
    load();
  }, []);

  return (
    <ProviderLayout>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Welcome, {user.name}!</h3>
        <p className="text-muted">Overview of your rental operations.</p>
      </div>

      {!user.isApproved && user.verificationStatus === "rejected" && (
        <Alert variant="danger" className="d-flex align-items-center gap-3 border-0 shadow-sm mb-4">
          <ShieldX className="flex-shrink-0" size={24} />
          <div>
            <Alert.Heading className="fs-5 fw-bold mb-1">Verification Rejected</Alert.Heading>
            <p className="mb-1 small">Reason: {user.verificationNote || "Not given"}</p>
            <p className="mb-0 small">Please <Link to="/contact">contact support</Link> to correct your documents.</p>
          </div>
        </Alert>
      )}
      {!user.isApproved && user.verificationStatus !== "rejected" && (
        <Alert variant="warning" className="d-flex align-items-center gap-3 border-0 shadow-sm mb-4">
          <Clock className="flex-shrink-0" size={24} />
          <div>
            <Alert.Heading className="fs-5 fw-bold mb-1">Account Pending Approval</Alert.Heading>
            <p className="mb-0 small">
              Our team is checking your CNIC and shop details. You will be able to add bikes and receive bookings once approved.
            </p>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        {[
          { title: "Total Bikes", value: stats.bikes, icon: Bike, tone: "success" },
          { title: "Requests Waiting", value: stats.pending, icon: Clock, tone: "warning", link: "/provider/bookings" },
          { title: "To Hand Over", value: stats.toHandOver, icon: KeyRound, tone: "info" },
          { title: "Bikes on Ride", value: stats.onRide, icon: CalendarCheck, tone: "primary" },
          { title: "My Earnings (90%)", value: stats.earnings, icon: Wallet, tone: "success" },
          { title: "Account Status", value: user.isApproved ? "Verified" : user.verificationStatus === "rejected" ? "Rejected" : "Pending", icon: Info, tone: "secondary" },
        ].map((card) => (
          <Col sm={6} lg={4} key={card.title}>
            <Card className="border-0 shadow-sm p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className={`rounded-circle p-3 bg-${card.tone} bg-opacity-10 text-${card.tone}`}>
                  <card.icon size={24} />
                </div>
                <div>
                  <h6 className="text-secondary mb-0">{card.title}</h6>
                  <h4 className="fw-bold mb-0">{card.value}</h4>
                  {card.link && <Link to={card.link} className="small text-decoration-none">Review requests</Link>}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </ProviderLayout>
  );
};

export default ProviderDashboard;

