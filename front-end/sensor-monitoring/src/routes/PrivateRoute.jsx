import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show loading while checking auth

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
