
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const RoleRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === "Manager" ? "/manager" : "/engineer"}
      replace
    />
  );
};

export default RoleRedirect;
