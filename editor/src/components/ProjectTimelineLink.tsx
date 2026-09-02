import React from "react";
import Link, { LinkProps } from "@mui/material/Link";
import { Link as RouterLink, useParams } from "react-router-dom";
import { getProjectTimelinePath } from "src/utils/projectTimeline";

interface ProjectTimelineLinkProps extends Omit<LinkProps, "href"> {
  projectId?: string | number;
  currentPhase?: object;
  currentPhaseId?: string | number;
  children: React.ReactNode;
}

/**
 * Makes its children a link to a project's Timeline tab.
 */
const ProjectTimelineLink = ({
  projectId,
  currentPhase,
  currentPhaseId,
  children,
  ...linkProps
}: ProjectTimelineLinkProps) => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const targetProjectId = projectId ?? routeProjectId;

  if (targetProjectId === undefined) {
    throw new Error(
      "ProjectTimelineLink requires a project ID or a project route"
    );
  }

  console.log(currentPhaseId);

  return (
    <Link
      {...linkProps}
      component={RouterLink}
      to={getProjectTimelinePath(targetProjectId)}
    >
      {children}
    </Link>
  );
};

export default ProjectTimelineLink;
