import React, { useRef, useState, useEffect } from "react";
import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";

const Header = () => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [localStorage.getItem("user")]); // Rough sync

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "provider") return "/provider/dashboard";
    return "/user/dashboard";
  };

  // Color palette
  const bgDark = "#0f172a";
  const accentGreen = "#22c55e";
  const mutedText = "#cbd5e1";

  return (
    <Navbar
      ref={headerRef}
      expand="lg"
      className="py-3 sticky-top shadow-sm"
      style={{ backgroundColor: bgDark }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 border-0">
          <span className="text-white">Ride</span>
          <span style={{ color: accentGreen }}>Rent</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-light" />

        <Navbar.Collapse id="main-navbar">
          {/* Navigation */}
          <Nav className="mx-auto gap-lg-4">
            <Nav.Link as={Link} to="/" style={{ color: mutedText }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Bike" style={{ color: mutedText }}>
              Browse Bikes
            </Nav.Link>
            {!user && (
              <Nav.Link as={Link} to="/register?role=provider" style={{ color: mutedText }}>
                Become a Provider
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/About" style={{ color: mutedText }}>
              About
            </Nav.Link>
          </Nav>

          {/* Actions */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center gap-2 text-white">
                    <img 
                       src={`https://ui-avatars.com/api/?name=${user.name}&background=22c55e&color=fff`} 
                       alt="User" 
                       className="rounded-circle border" 
                       width="32" 
                    />
                    <span className="small d-none d-lg-inline">{user.name}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="custom-dropdown"
              >
                <NavDropdown.Item as={Link} to={getDashboardLink()} className="d-flex align-items-center gap-2 py-2">
                  <LayoutDashboard size={16} className="text-success" /> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 py-2 text-danger">
                  <LogOut size={16} /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-light" size="sm" className="px-3">
                  Login
                </Button>
                <Button as={Link} to="/register" size="sm" className="px-3 border-0" style={{ backgroundColor: accentGreen }} variant="outline-light">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
