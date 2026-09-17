import React from "react";
import Link, { type LinkProps } from "@mui/material/Link";
import { Link as RouterLink, useParams, useSearchParams } from "react-router";
import { getMopedDataGridRowLinkPath } from "src/utils/mopedDataGridRowLinkPath";

interface MopedDataGridRowLinkProps extends Omit<LinkProps, "href"> {
  projectId?: string | number;
  tab: string;
  paramLabel?: string;
  paramId?: string | number;
  children: React.ReactNode;
}

/**
 * Makes its children a link to a project's selected tab.
 */
const MopedDataGridRowLink = ({
  projectId,
  tab,
  paramLabel,
  paramId,
  children,
  onClick,
  ...linkProps
}: MopedDataGridRowLinkProps) => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetProjectId = projectId ?? routeProjectId;

  if (paramLabel === undefined) {
    throw new Error("MopedDataGridRowLink requires a param label");
  }
  if (targetProjectId === undefined) {
    throw new Error(
      "MopedDataGridRowLink requires a project ID or a project route"
    );
  }

  return (
    <Link
      {...linkProps}
      component={RouterLink}
      to={getMopedDataGridRowLinkPath(targetProjectId, tab)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();

        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set("tab", tab);

        if (paramId === undefined) {
          nextSearchParams.delete(paramLabel);
        } else {
          nextSearchParams.set(paramLabel, String(paramId));
        }

        setSearchParams(nextSearchParams);
      }}
    >
      {children}
    </Link>
  );
};

export default MopedDataGridRowLink;
