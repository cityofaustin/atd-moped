import React from "react";
import { useAuth } from "src/auth/auth";
import { Navigate } from "react-router";

const Logout = () => {
  const { logout } = useAuth();

  const logoutAndRedirect = () => {
    logout();
    return <Navigate to="/" />;
  };

  return logoutAndRedirect();
};

export default Logout;
