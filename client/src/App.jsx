import './App.css'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Bike from "./pages/Bike/Bike";
import BikeDetails from './pages/Bike/BikeDetails';

// Admin Pages
import AdminDashboard from "./dashboards/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminVerifications from "./pages/Admin/AdminVerifications";
import AdminBikes from "./pages/Admin/AdminBikes";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminMessages from "./pages/Admin/AdminMessages";

// Provider Pages
import ProviderDashboard from "./pages/Provider/ProviderDashboard";
import ProviderBikes from "./pages/Provider/ProviderBikes";
import ProviderAddBike from "./pages/Provider/ProviderAddBike";
import ProviderBookings from "./pages/Provider/ProviderBookings";

// User Pages
import UserDashboard from "./pages/User/UserDashboard";

// Components
import Footer from './components/Footer';
import Header from './components/Header';
import CustomerSupport from './components/Chatbot/ChatButton';

// Routes
import AdminRoute from "./routes/AdminRoute";
import ProviderRoute from "./routes/ProviderRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isProviderPath = location.pathname.startsWith("/provider");

  return (
    <>
      {!isAdminPath && !isProviderPath && <Header />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bike" element={<Bike />} />
        <Route path="/bike/:id" element={<BikeDetails />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/verifications" element={<AdminRoute><AdminVerifications /></AdminRoute>} />
        <Route path="/admin/providers" element={<Navigate to="/admin/verifications" replace />} />
        <Route path="/admin/bikes" element={<AdminRoute><AdminBikes /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />

        {/* Provider Routes (Protected) */}
        <Route path="/provider/dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
        <Route path="/provider/my-bikes" element={<ProviderRoute><ProviderBikes /></ProviderRoute>} />
        <Route path="/provider/add-bike" element={<ProviderRoute><ProviderAddBike /></ProviderRoute>} />
        <Route path="/provider/bookings" element={<ProviderRoute><ProviderBookings /></ProviderRoute>} />

        {/* User Routes (Protected) */}
        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      </Routes>

      {!isAdminPath && !isProviderPath && <Footer />}
      {!isAdminPath && !isProviderPath && <CustomerSupport />}
    </>
  )
}

export default App
