import React from "react";
import { useUser } from "../../auth/user";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useUser();

  const logoutAndRedirect = () => {
    logout();
    return <Navigate to="/" />;
  };

  return logoutAndRedirect();
};

export default Logout;
