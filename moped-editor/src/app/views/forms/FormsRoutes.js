import React from "react";

const formsRoutes = [
  {
    path: "/forms/basic",
    component: React.lazy(() => import("./BasicForm"))
  },
  {
    path: "/forms/editor",
    component: React.lazy(() => import("./EditorForm"))
  },
  {
    path: "/forms/new-project",
    component: React.lazy(() => import("./NewProject"))
  },
  {
    path: "/forms/getData",
    component: React.lazy(() => import("./getData"))
  }
];

export default formsRoutes;
