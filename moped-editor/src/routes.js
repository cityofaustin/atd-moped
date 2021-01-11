import React from "react";
import { Navigate } from "react-router-dom";
import Can from "src/auth/Can";
import DashboardLayout from "src/layouts/DashboardLayout/DashboardLayout";
import MainLayout from "src/layouts/MainLayout/MainLayout";
import AccountView from "src/views/account/AccountView/AccountView";
import StaffListView from "src/views/staff/StaffListView";
import NewStaffView from "src/views/staff/NewStaffView";
import EditStaffView from "src/views/staff/EditStaffView";
import DashboardView from "src/views/reports/DashboardView/DashboardView";
import LoginView from "src/views/auth/LoginView";
import NotFoundView from "src/views/errors/NotFoundView";
import NewProjectView from "src/views/projects/newProjectView/NewProjectView";
import ProjectSummary from "src/views/projects/projectView/ProjectView";
import RegisterView from "src/views/auth/RegisterView";
import SettingsView from "src/views/settings/SettingsView/SettingsView";
import ProjectsListView from "./views/projects/projectsListView/ProjectsListView";

export const routes = [
  { path: "/", element: <Navigate to="/moped" /> },
  {
    path: "moped/session",
    element: <MainLayout />,
    children: [
      { path: "signin", element: <LoginView /> },
      { path: "register", element: <RegisterView /> },
      { path: "*", element: <Navigate to="/signin" /> },
    ],
  },
  {
    path: "moped",
    action: "moped:visit",
    element: <DashboardLayout />,
    children: [
      { path: "/", action: "moped:visit", element: <DashboardView /> },
      {
        path: "dashboard",
        action: "dashboard:visit",
        element: <DashboardView />,
      },
      { path: "account", action: "account:visit", element: <AccountView /> },
      { path: "staff", action: "staff:visit", element: <StaffListView /> },
      {
        path: "staff/new",
        action: "newStaff:visit",
        element: <NewStaffView />,
      },
      {
        path: "staff/edit/:userId",
        action: "editStaff:visit",
        element: <EditStaffView />,
      },
      {
        path: "projects",
        action: "projects:visit",
        element: <ProjectsListView />,
      },
      {
        path: "projects/new",
        action: "newProjects:visit",
        element: <NewProjectView />,
      },
      {
        path: "projects/:projectId",
        action: "project:visit",
        element: <ProjectSummary />,
      },
      { path: "settings", action: "settings:visit", element: <SettingsView /> },
      { path: "404", action: "notFound:visit", element: <NotFoundView /> },
      {
        path: "*",
        action: "undefinedRoute:visit",
        element: <Navigate to="/moped/404" />,
      },
    ],
  },
];

const unprotectedRoutePaths = ["/", "moped/session"];

/**
 * Map through defined routes and child routes to wrap protected route elements with the Can component
 * Route actions are passed to the Can component to check access and render the route's element or redirect to root
 * @param {Array} routes - Routes composed to pass as arg to React Route useRoutes hook
 * @return {Array} Routes array with protected route's element wrapped with Can component
 */
export const restrictRoutes = routes =>
  routes.map(route => {
    if (unprotectedRoutePaths.includes(route.path)) {
      return route;
    } else if (route.children) {
      const restrictedChildren = restrictRoutes(route.children);
      route.children = restrictedChildren;
      return route;
    } else {
      const wrappedRouteElement = (
        <Can
          perform={route.action}
          yes={route.element}
          no={<Navigate to="/" />}
        />
      );
      const protectedRoute = { ...route, element: wrappedRouteElement };

      return protectedRoute;
    }
  });
