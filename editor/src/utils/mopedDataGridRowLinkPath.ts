import { useCallback } from "react";
import { useNavigate, useParams } from "react-router";

export const getMopedDataGridRowLinkPath = (
  projectId: string | number,
  tab: string
) => `/moped/projects/${projectId}?tab=${tab}`;

/**
 * Returns a callback that navigates to a project's selected tab.
 * When no project ID is provided, the ID from the current project route is used.
 */
export const useNavigateToMopedDataGridRow = (
  projectId?: string | number,
  tab?: string
) => {
  console.log("useNavigateToMopedDataGridRow", { projectId, tab });
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const targetProjectId = projectId ?? routeProjectId;

  return useCallback(() => {
    if (targetProjectId === undefined) {
      throw new Error(
        "useNavigateToMopedDataGridRow requires a project ID or a project route"
      );
    }
    if (tab === undefined) {
      throw new Error("useNavigateToMopedDataGridRow requires a tab name");
    }

    navigate(getMopedDataGridRowLinkPath(targetProjectId, tab));
  }, [navigate, targetProjectId, tab]);
};
