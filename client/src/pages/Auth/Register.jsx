import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup, Spinner } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, ShieldCheck, User, Store } from "lucide-react";
import { register, getCaptcha } from "../../services/authService";
import { PK_CITIES } from "../../constants/cities";
import { showSuccess } from "../../utils/alerts";

const MAX_FILE_MB = 3;

// 3520212345671 -> 35202-1234567-1
const formatCnic = (value) => {
  const d = value.replace(/\D/g, "").slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
};

// 03001234567 -> 0300-1234567
const formatPhone = (value) => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d.length <= 4 ? d : `${d.slice(0, 4)}-${d.slice(4)}`;
};

// Label with a red asterisk for required fields
const Req = ({ children }) => (
  <Form.Label>
    {children} <span className="text-danger">*</span>
  </Form.Label>
);

const EMPTY = {
  name: "", email: "", phone: "", cnic: "", city: "", address: "", licenseNumber: "", shopName: "",
  password: "", confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") === "provider" ? "provider" : "user");
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState({ cnicFront: null, cnicBack: null });
  const [previews, setPreviews] = useState({ cnicFront: "", cnicBack: "" });
  const [captcha, setCaptcha] = useState({ question: "", token: "" });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProvider = role === "provider";

  const loadCaptcha = useCallback(async () => {
    setCaptchaAnswer("");
    try {
      const res = await getCaptcha();
      setCaptcha(res.data);
    } catch {
      setCaptcha({ question: "", token: "" });
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formatted = name === "cnic" ? formatCnic(value) : name === "phone" ? formatPhone(value) : value;
    setForm({ ...form, [name]: formatted });
  };

  const handleFile = (e) => {
    const { name, files: chosen } = e.target;
    const file = chosen[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("CNIC images must be JPG or PNG.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Each CNIC image must be smaller than ${MAX_FILE_MB} MB.`);
      e.target.value = "";
      return;
    }
    setError("");
    setFiles((prev) => ({ ...prev, [name]: file }));
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return setError("Password must be at least 8 characters and include letters and numbers.");
    }
    if (!/^\d{5}-\d{7}-\d$/.test(form.cnic)) return setError("Enter your 13-digit CNIC number.");
    if (!/^03\d{2}-\d{7}$/.test(form.phone)) return setError("Enter a Pakistani mobile number like 0300-1234567.");
    if (!files.cnicFront || !files.cnicBack) return setError("Please upload both sides of your CNIC.");
    if (!agree) return setError("Please accept the terms to continue.");

    const data = new FormData();
    data.append("role", role);
    Object.entries(form).forEach(([key, value]) => key !== "confirmPassword" && data.append(key, value.trim()));
    data.append("cnicFront", files.cnicFront);
    data.append("cnicBack", files.cnicBack);
    data.append("captchaToken", captcha.token);
    data.append("captchaAnswer", captchaAnswer);

    try {
      setLoading(true);
      const user = await register(data);
      await showSuccess(
        "Account created",
        "Your CNIC will be checked by our team. You will be able to " +
          (user.role === "provider" ? "list bikes" : "book bikes") + " after approval."
      );
      navigate(user.role === "provider" ? "/provider/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const fileField = (name, label) => (
    <Col sm={6}>
      <Form.Group className="mb-3">
        <Req>{label}</Req>
        <Form.Control type="file" name={name} accept="image/jpeg,image/png" onChange={handleFile} />
        {previews[name] && (
          <img src={previews[name]} alt={label} className="img-thumbnail mt-2" style={{ maxHeight: "110px" }} />
        )}
      </Form.Group>
    </Col>
  );

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9} xl={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <h3 className="fw-bold text-center mb-1">Create Your Account</h3>
              <p className="text-muted text-center mb-4">
                Fields marked <span className="text-danger">*</span> are required. Your CNIC is checked by our team before approval.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Role */}
                <Row className="g-3 mb-4">
                  {[
                    { value: "user", icon: User, title: "Customer", text: "I want to rent bikes" },
                    { value: "provider", icon: Store, title: "Bike Provider (Vendor)", text: "I want to list my bikes" },
                  ].map((opt) => (
                    <Col sm={6} key={opt.value}>
                      <button
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`w-100 text-start p-3 rounded border ${role === opt.value ? "border-success border-2 bg-success bg-opacity-10" : "bg-white"}`}
                      >
                        <opt.icon size={20} className="text-success me-2" />
                        <strong>{opt.title}</strong>
                        <div className="small text-muted">{opt.text}</div>
                      </button>
                    </Col>
                  ))}
                </Row>

                <h6 className="fw-bold text-success mb-3">Personal details</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Full name (as on CNIC)</Req>
                      <Form.Control name="name" value={form.name} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Email</Req>
                      <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Mobile number</Req>
                      <Form.Control name="phone" placeholder="03XX-XXXXXXX" inputMode="numeric" value={form.phone} onChange={handleChange} required />
                      <Form.Text muted>Shared with the other side only after a booking is accepted.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>CNIC number</Req>
                      <Form.Control name="cnic" placeholder="12345-1234567-1" inputMode="numeric" value={form.cnic} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>City</Req>
                      <Form.Select name="city" value={form.city} onChange={handleChange} required>
                        <option value="">Choose city</option>
                        {PK_CITIES.map((c) => <option key={c}>{c}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {isProvider ? (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Req>Shop / business name</Req>
                        <Form.Control name="shopName" value={form.shopName} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  ) : (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Req>Driving licence number</Req>
                        <Form.Control name="licenseNumber" placeholder="e.g. LHR-2022-123456" value={form.licenseNumber} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  )}
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Req>{isProvider ? "Shop address (pick-up location for customers)" : "Home address"}</Req>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        placeholder={isProvider ? "Shop no., road / market, area, city" : "House no., street, area, city"}
                        value={form.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="fw-bold text-success mb-3 mt-2 d-flex align-items-center gap-2">
                  <ShieldCheck size={18} /> Identity verification (CNIC)
                </h6>
                <Row>
                  {fileField("cnicFront", "CNIC front side")}
                  {fileField("cnicBack", "CNIC back side")}
                </Row>
                <p className="small text-muted">
                  JPG or PNG, max {MAX_FILE_MB} MB each. Images are stored privately and only our admin team can see them.
                </p>

                <h6 className="fw-bold text-success mb-3 mt-2">Account security</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Password</Req>
                      <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
                      <Form.Text muted>At least 8 characters with letters and numbers.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Confirm password</Req>
                      <Form.Control type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Req>Human verification</Req>
                      <InputGroup>
                        <InputGroup.Text className="fw-bold" style={{ minWidth: "96px" }}>
                          {captcha.question ? `${captcha.question} =` : <Spinner size="sm" />}
                        </InputGroup.Text>
                        <Form.Control
                          inputMode="numeric"
                          placeholder="Answer"
                          value={captchaAnswer}
                          onChange={(e) => setCaptchaAnswer(e.target.value)}
                          required
                        />
                        <Button variant="outline-secondary" onClick={loadCaptcha} title="New question" aria-label="New question">
                          <RefreshCw size={16} />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Check
                  id="agree"
                  className="mb-4"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  label={
                    <span>
                      I confirm my details are correct and agree to the rental rules
                      {isProvider ? " (bikes must be roadworthy with valid registration papers)" : " (I will carry my original CNIC and licence at pick-up)"}.
                      <span className="text-danger"> *</span>
                    </span>
                  }
                />

                <Button type="submit" className="w-100" disabled={loading} style={{ backgroundColor: "#1f8f4a", border: "none" }}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center small mt-3">
                  Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
