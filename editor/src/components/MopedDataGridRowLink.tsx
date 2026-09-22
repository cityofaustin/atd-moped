import type { ReactNode } from "react";
import Link, { type LinkProps } from "@mui/material/Link";
import { Link as RouterLink, useLocation, useSearchParams } from "react-router";

interface MopedDataGridRowLinkProps extends Omit<LinkProps, "href"> {
  projectId: number;
  tab:
    | "summary"
    | "map"
    | "timeline"
    | "team"
    | "funding"
    | "notes"
    | "files"
    | "activity_log";
  paramId: number;
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
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.set("tab", tab);

  if (paramId === undefined) {
    nextSearchParams.delete("highlightedRowId");
  } else {
    nextSearchParams.set("highlightedRowId", String(paramId));
  }

  const destination = {
    pathname: `/moped/projects/${projectId}`,
    search: `?${nextSearchParams.toString()}`,
  };

  return (
    <Link
      {...linkProps}
      component={RouterLink}
      state={location.state}
      to={destination}
    >
      {children}
    </Link>
  );
};

export default MopedDataGridRowLink;
