import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../Pages/common/NotFound";

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && role !== "admin") {
    return <NotFound />;
  }

  return children;
};

export default ProtectedRoute;
