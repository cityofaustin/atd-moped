import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const getProjectTimelinePath = (projectId: string | number) =>
  `/moped/projects/${projectId}?tab=timeline`;

/**
 * Returns a callback that navigates to a project's Timeline tab.
 * When no project ID is provided, the ID from the current project route is used.
 */
export const useNavigateToProjectTimeline = (projectId?: string | number) => {
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const targetProjectId = projectId ?? routeProjectId;

  return useCallback(() => {
    if (targetProjectId === undefined) {
      throw new Error(
        "useNavigateToProjectTimeline requires a project ID or a project route"
      );
    }

    navigate(getProjectTimelinePath(targetProjectId));
  }, [navigate, targetProjectId]);
};
