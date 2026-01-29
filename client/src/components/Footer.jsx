import React, { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container, Row, Col } from 'react-bootstrap';

gsap.registerPlugin(ScrollTrigger);

const MinimalFooter = () => {
  const footerRef = useRef(null);

  useGSAP(() => {
    // Subtle reveal animation for footer columns
    gsap.from(".footer-reveal", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%", // Starts when footer is near bottom of viewport
      }
    });
  }, { scope: footerRef });

  const charcoal = "#1a1a1a";
  const accentBlue = "#007bff";

  return (
    
    <footer ref={footerRef} className="text-white pt-5" style={{ backgroundColor: charcoal }}>
      
      {/* Top Accent Bar */}
      <div className="py-3 mb-5" style={{ backgroundColor: accentBlue }}>
        <Container className="d-flex justify-content-between align-items-center">
          <span className="small fw-light">Ready to elevate your digital presence?</span>
          <div className="d-flex gap-3">
            {/* Social Icons (Assuming FontAwesome is loaded) */}
            <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="text-white"><i className="fab fa-github"></i></a>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="gy-4">
          <Col lg={4} className="footer-reveal">
            <h6 className="text-uppercase fw-bold mb-4" style={{ color: accentBlue }}>Nexus Studio</h6>
            <p className="text-secondary lh-lg">
              A minimal approach to modern design. We focus on readability, 
              performance, and calm aesthetics.
            </p>
          </Col>

          <Col md={4} lg={2} className="ms-auto footer-reveal">
            <h6 className="text-uppercase fw-bold mb-4 small">Navigation</h6>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2"><a href="#" className="nav-link p-0 hover-blue">Our Work</a></li>
              <li className="mb-2"><a href="#" className="nav-link p-0 hover-blue">Services</a></li>
              <li className="mb-2"><a href="#" className="nav-link p-0 hover-blue">Contact</a></li>
            </ul>
          </Col>

          <Col md={4} lg={3} className="footer-reveal">
            <h6 className="text-uppercase fw-bold mb-4 small">Contact</h6>
            <div className="text-secondary small">
              <p className="mb-1">hello@nexusstudio.com</p>
              <p>+1 (555) 000-1234</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Subtle Bottom Copyright */}
      <div className="py-4 border-top border-secondary border-opacity-25">
        <Container className="text-center">
          <p className="small text-secondary mb-0">© {new Date().getFullYear()} Minimalist Lab. Designed for focus.</p>
        </Container>
      </div>
    </footer>
  );
};

export default MinimalFooter;
