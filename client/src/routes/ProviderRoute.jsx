import { Navigate } from "react-router-dom";

const ProviderRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "provider") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProviderRoute;
