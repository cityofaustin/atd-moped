import { useEffect } from "react";
import { useAuth } from "src/auth/auth";
import { Navigate } from "react-router";

const Logout = () => {
  const { status, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  if (status === "authenticated") return null;

  return <Navigate to="/" replace />;
};

export default Logout;
