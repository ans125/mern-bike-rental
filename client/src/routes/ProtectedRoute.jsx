import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Renter pages only; admins and providers go to their own dashboards
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.role === "provider") return <Navigate to="/provider/dashboard" />;

  return children;
};

export default ProtectedRoute;
