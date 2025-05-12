import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // If authenticated, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
