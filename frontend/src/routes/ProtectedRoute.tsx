
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: ("Engineer" | "Manager")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "Manager" ? "/manager" : "/engineer"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
