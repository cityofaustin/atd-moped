import React from "react";
import { NavLink as RouterLink } from "react-router-dom";

const RenderFieldLink = ({ projectId, value, tab }) => {
  const route = tab
    ? `/moped/projects/${projectId}?tab=${tab}`
    : `/moped/projects/${projectId}/`;
  return (
    <RouterLink
      to={route}
      className={"MuiTypography-colorPrimary"}
    >
      {value}
    </RouterLink>
  );
};

export default RenderFieldLink;
