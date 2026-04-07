import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bike, 
  PlusCircle, 
  CalendarCheck, 
  LogOut 
} from "lucide-react";

const ProviderSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/provider/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/provider/my-bikes", icon: Bike, label: "My Fleet" },
    { path: "/provider/add-bike", icon: PlusCircle, label: "Add New Bike" },
    { path: "/provider/bookings", icon: CalendarCheck, label: "Fleet Bookings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white border-end vh-100 position-sticky top-0" style={{ width: "260px" }}>
      <div className="p-4 border-bottom">
        <h5 className="fw-bold mb-0" style={{ color: "#198754" }}>Provider Hub</h5>
      </div>
      
      <Nav className="flex-column p-3 gap-1">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center gap-3 p-3 rounded transition-all ${
              location.pathname === item.path 
                ? "bg-success text-white shadow-sm" 
                : "text-secondary hover-bg-light"
            }`}
          >
            <item.icon size={20} />
            <span className="fw-medium">{item.label}</span>
          </Nav.Link>
        ))}

        <div className="mt-auto pt-4">
          <Nav.Link
            onClick={handleLogout}
            className="d-flex align-items-center gap-3 p-3 rounded text-danger hover-bg-danger-light mt-5"
            style={{ cursor: "pointer" }}
          >
            <LogOut size={20} />
            <span className="fw-medium">Logout</span>
          </Nav.Link>
        </div>
      </Nav>
    </div>
  );
};

export default ProviderSidebar;
