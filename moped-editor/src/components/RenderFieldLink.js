import React from "react";
import { NavLink as RouterLink } from "react-router-dom";
import theme from "src/theme/index"

const RenderFieldLink = ({ projectId, value, tab }) => {
  const route = tab
    ? `/moped/projects/${projectId}?tab=${tab}`
    : `/moped/projects/${projectId}/`;
  return (
    <RouterLink
      to={route}
      style={{color: theme.palette.primary.main}}
    >
      {value}
    </RouterLink>
  );
};

export default RenderFieldLink;
