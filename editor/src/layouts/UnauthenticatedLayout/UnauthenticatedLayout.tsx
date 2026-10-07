import { Outlet, Navigate } from "react-router";
import Box from "@mui/material/Box";
import AuthLoadingBackdrop from "src/auth/AuthLoadingBackdrop";
import { useAuth } from "src/auth/auth";
import { takeReturnTo } from "src/auth/returnTo";

/**
 * Main layout component for the app when not logged in (sign in page).
 */
const UnauthenticatedLayout = () => {
  const { status } = useAuth();

  if (status === "initializing") {
    return <AuthLoadingBackdrop open={true} />;
  }

  /* If authenticated, send users wherever they were headed before sign-in or to
   * default route. See src/auth/returnTo.js — AuthenticatedLayout stores the
   * path in sessionStorage so it survives the SSO redirect.
   */
  if (status === "authenticated") {
    const routeToRestore = takeReturnTo();
    return <Navigate to={routeToRestore ?? "/moped"} replace />;
  }

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        display: "flex",
        height: "100%",
        overflow: "hidden",
        width: "100%",
      })}
    >
      <Box
        sx={{
          flex: "1 1 auto",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UnauthenticatedLayout;
