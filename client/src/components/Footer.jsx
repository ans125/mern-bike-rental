import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".footer-item", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
      },
    });
  }, { scope: footerRef });

  const bgDark = "#0f172a";
  const accentGreen = "#22c55e";
  const mutedText = "#94a3b8";

  return (
    <footer ref={footerRef} className="pt-5 text-white" style={{ backgroundColor: bgDark }}>
      
      {/* Accent strip */}
      <div className="py-3 mb-5" style={{ backgroundColor: accentGreen }}>
        <Container className="text-center">
          <span className="fw-light small">
            A modern bike rental platform built for Pakistan
          </span>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="gy-4">
          
          {/* Brand */}
          <Col lg={4} className="footer-item">
            <h5 className="fw-bold mb-3">
              Ride<span style={{ color: accentGreen }}>Rent</span>
            </h5>
            <p className="lh-lg" style={{ color: mutedText }}>
              RideRent is a web-based bike rental application that allows bike
              owners to list their bikes and customers to rent them easily
              through a simple and secure platform.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} lg={2} className="ms-auto footer-item">
            <h6 className="text-uppercase fw-bold mb-3 small">
              Quick Links
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: mutedText }}>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: mutedText }}>
                  Browse Bikes
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none" style={{ color: mutedText }}>
                  Provider Portal
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4} lg={3} className="footer-item">
            <h6 className="text-uppercase fw-bold mb-3 small">
              Contact
            </h6>
            <div className="small" style={{ color: mutedText }}>
              <p className="mb-1">support@riderent.pk</p>
              <p className="mb-0">Pakistan</p>
            </div>
          </Col>

        </Row>
      </Container>

      {/* Bottom */}
      <div className="py-4 border-top border-secondary border-opacity-25">
        <Container className="text-center">
          <p className="small mb-0" style={{ color: mutedText }}>
            © {new Date().getFullYear()} RideRent. Built with MERN Stack.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
