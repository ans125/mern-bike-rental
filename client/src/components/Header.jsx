import React, { useRef } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const Header = () => {
  const headerRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  // Color palette
  const bgDark = "#0f172a";
  const accentGreen = "#22c55e";
  const mutedText = "#cbd5e1";

  return (
    <Navbar
      ref={headerRef}
      expand="lg"
      // sticky="top"
      className="py-3"
      style={{ backgroundColor: bgDark }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand href="/" className="fw-bold fs-4">
          <span className="text-white">Ride</span>
          <span style={{ color: accentGreen }}>Rent</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* Navigation */}
          <Nav className="mx-auto gap-lg-4">
            <Nav.Link  as={Link} to="/Home"  style={{ color: mutedText }} >
              Home
            </Nav.Link>
            <Nav.Link  as={Link} to="/Bike"  style={{ color: mutedText }} >
              Browse Bikes
            </Nav.Link>
            <Nav.Link  as={Link} to="/"  style={{ color: mutedText }} >
              Become a Provider
            </Nav.Link>
            <Nav.Link  as={Link} to="/"  style={{ color: mutedText }} >
              About
            </Nav.Link>
          </Nav>

          {/* Actions */}
          <div className="d-flex gap-2">
            <Button
               as={Link}
              to="/login"
              variant="outline-light"
              size="sm"
            >


              Login
            </Button>
            <Button
              size="sm"
              className="px-3 border-0"
              style={{ backgroundColor: accentGreen }}
               as={Link}
              to="/register"
              variant="outline-light"
            >
              Sign Up
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
