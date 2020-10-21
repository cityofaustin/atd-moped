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
    path: "/forms/DefineProject",
    component: React.lazy(() => import("./DefineProject"))
  }
];

export default formsRoutes;
