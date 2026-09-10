import React from "react";
import Link, { LinkProps } from "@mui/material/Link";
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getProjectTimelinePath } from "src/utils/projectTimeline";

interface ProjectTimelineLinkProps extends Omit<LinkProps, "href"> {
  projectId?: string | number;
  currentPhaseId?: string | number;
  children: React.ReactNode;
}

/**
 * Makes its children a link to a project's Timeline tab.
 */
const ProjectTimelineLink = ({
  projectId,
  currentPhaseId,
  children,
  onClick,
  ...linkProps
}: ProjectTimelineLinkProps) => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetProjectId = projectId ?? routeProjectId;

  if (targetProjectId === undefined) {
    throw new Error(
      "ProjectTimelineLink requires a project ID or a project route"
    );
  }

  return (
    <Link
      {...linkProps}
      component={RouterLink}
      to={getProjectTimelinePath(targetProjectId)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();

        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set("tab", "timeline");

        if (currentPhaseId === undefined) {
          nextSearchParams.delete("currentPhaseId");
        } else {
          nextSearchParams.set("currentPhaseId", String(currentPhaseId));
        }

        setSearchParams(nextSearchParams);
      }}
    >
      {children}
    </Link>
  );
};

export default ProjectTimelineLink;
