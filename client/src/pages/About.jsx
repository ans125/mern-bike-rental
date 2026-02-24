import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    gsap.from(".about-animate", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, []);

  const bgLight = "#f8fafc";
  const accentGreen = "#22c55e";
  const darkText = "#0f172a";
  const mutedText = "#475569";

  return (
    <section
      ref={aboutRef}
      className="py-5"
      style={{ backgroundColor: bgLight }}
    >
      <Container>
        {/* Heading */}
        <div className="text-center mb-5 about-animate">
          <h2 className="fw-bold" style={{ color: darkText }}>
            About <span style={{ color: accentGreen }}>RideRent</span>
          </h2>
          <p className="mt-3" style={{ color: mutedText, maxWidth: "700px", margin: "0 auto" }}>
           Making bike rental simple, accessible, and digital.
          </p>
        </div>

        <Row className="align-items-center g-5">
          {/* Image / GIF */}
          <Col
            md={6}
            className="about-animate d-flex justify-content-center align-items-center"
          >
            <img
              src="/images/about.gif"
              alt="Bike rental illustration"
              className="shadow"
              style={{
                width: "350px",        
                height: "400px",      
                objectFit: "cover", 
                borderRadius: "50%",   
              }}
            />
          </Col>
          {/* Content */}
          <Col md={6} className="about-animate">
            <h4 className="fw-semibold mb-3" style={{ color: darkText }}>
              What is RideRent?
            </h4>
            <p style={{ color: mutedText, lineHeight: "1.8" }}>
              Finding a bike for rent is still a problem for many people. In most areas, there is no reliable online system to check bike availability, compare prices, or contact bike owners easily. 
            </p>

            <p style={{ color: mutedText, lineHeight: "1.8" }}>
              Customers often depend on local contacts or physical visits, which wastes time and creates trust issues. At the same time, many bike owners want to earn from their bikes but do not have a proper platform to list them online.
            </p>

            <div className="mt-4">
              <span
                className="fw-semibold px-3 py-2 rounded-pill text-white"
                style={{ backgroundColor: accentGreen, fontSize: "0.9rem" }}
              >
                Built for Pakistan 🇵🇰
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;