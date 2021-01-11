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

export const routesObj = [
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
    action: "visit:moped",
    element: <DashboardLayout />,
    children: [
      { path: "/", action: "visit:moped", element: <DashboardView /> },
      {
        path: "dashboard",
        action: "visit:dashboard",
        element: <DashboardView />,
      },
      { path: "account", action: "visit:account", element: <AccountView /> },
      { path: "staff", action: "visit:staff", element: <StaffListView /> },
      {
        path: "staff/new",
        action: "visit:newStaff",
        element: <NewStaffView />,
      },
      {
        path: "staff/edit/:userId",
        action: "visit:editStaff",
        element: <EditStaffView />,
      },
      {
        path: "projects",
        action: "visit:projects",
        element: <ProjectsListView />,
      },
      {
        path: "projects/new",
        action: "visit:newProjects",
        element: <NewProjectView />,
      },
      {
        path: "projects/:projectId",
        action: "visit:project",
        element: <ProjectSummary />,
      },
      { path: "settings", action: "visit:settings", element: <SettingsView /> },
      { path: "404", action: "visit:notFound", element: <NotFoundView /> },
      {
        path: "*",
        action: "visit:undefinedRoute",
        element: <Navigate to="/moped/404" />,
      },
    ],
  },
];

const unprotectedRoutes = ["/", "moped/session"];

export const restrictRoutes = routes =>
  routes.map(route => {
    if (!unprotectedRoutes.includes(route.path)) {
      if (route.children) {
        route.children = restrictedRoutes(route.children);
      } else {
        // const wrappedComponent =
      }
    } else {
      return route;
    }
  });

// 1. Add action to each route above
// 2. Iterate through routes and wrap elements with Can
