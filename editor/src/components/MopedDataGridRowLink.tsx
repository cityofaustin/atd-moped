import type { ReactNode } from "react";
import Link, { type LinkProps } from "@mui/material/Link";
import { Link as RouterLink, useParams, useSearchParams } from "react-router";

interface MopedDataGridRowLinkProps extends Omit<LinkProps, "href"> {
  projectId?: string | number;
  tab: string;
  paramId?: string | number;
  children: ReactNode;
}

/**
 * Makes its children a link to a project's selected tab.
 */
const MopedDataGridRowLink = ({
  projectId,
  tab,
  paramId,
  children,
  ...linkProps
}: MopedDataGridRowLinkProps) => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const targetProjectId = projectId ?? routeProjectId;

  if (targetProjectId === undefined) {
    throw new Error(
      "MopedDataGridRowLink requires a project ID or a project route"
    );
  }

  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.set("tab", tab);

  if (paramId === undefined) {
    nextSearchParams.delete("highlightedRowId");
  } else {
    nextSearchParams.set("highlightedRowId", String(paramId));
  }

  const destinationPath = `/moped/projects/${targetProjectId}?tab=${tab}`;
  const destination = `${destinationPath.split("?")[0]}?${nextSearchParams}`;

  return (
    <Link
      {...linkProps}
      component={RouterLink}
      to={destination}
    >
      {children}
    </Link>
  );
};

export default MopedDataGridRowLink;
