import React from "react";
import { useQuery } from "@apollo/client";

// Material
import {
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import Page from "src/components/Page";
import MaterialTable from "@material-table/core";

import RenderFieldLink from "../projects/signalProjectTable/RenderFieldLink";
import ProjectStatusBadge from "../projects/projectView/ProjectStatusBadge";

import typography from "../../theme/typography";

import { USER_FOLLOWED_PROJECTS_QUERY } from "../../queries/dashboard";
import { STATUS_QUERY } from "../../queries/project";

import { getSessionDatabaseData } from "../../auth/user";

const DashboardView = () => {
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData.user_id;

  const { loading, error, data } = useQuery(USER_FOLLOWED_PROJECTS_QUERY, {
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  const { referenceData } = useQuery(STATUS_QUERY);

  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  if (error) {
    console.log(error);
  }
  if (loading || !data) {
    return <CircularProgress />;
  }

  /**
   * Returns a ProjectStatusBadge component based on the status and phase of project
   * @param {string} phase - A project's current phase
   * @param {number} statusId - Project's status id
   * @return {JSX.Element}
   */
  const buildStatusBadge = (phase, statusId) => (
    <ProjectStatusBadge
      status={statusId}
      phase={phase}
      projectStatuses={referenceData?.moped_status ?? []}
      condensed
    />
  );

  const columns = [
    {
      title: "Project name",
      field: "project.project_name",
      editable: "never",
      cellStyle: { ...typographyStyle, minWidth: "200px" },
      render: entry => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_name}
        />
      ),
    },
    {
      title: "Status",
      field: "current_phase",
      editable: "never",
      cellStyle: { ...typographyStyle, minWidth: "300px" },
      render: entry =>
        buildStatusBadge(entry.current_phase, entry.current_status),
    },
    {
      title: "Status update",
      field: "status_update", // Status update (from Project details page)
      editable: "never",
      cellStyle: { ...typographyStyle, minWidth: "300px" },
    },
  ];

  /**
   * Build data needed in Dashboard Material Table
   */
  data.moped_user_followed_projects.forEach(project => {
    project["project_name"] = project.project.project_name;
    project["project_id"] = project.project.project_id;
    project["current_phase"] = project.project.current_phase;
    project["current_status"] = project.project.current_status;

    // project status update equivalent to most recent project note
    project["status_update"] = "";
    if (project?.project?.moped_proj_notes?.length) {
      const note = project.project.moped_proj_notes[0]["project_note"];
      // Remove any HTML tags
      project["status_update"] = note
        ? String(note).replace(/(<([^>]+)>)/gi, "")
        : "";
    }
  });

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Page title={"Dashboard"}>
            <MaterialTable
              columns={columns}
              data={data.moped_user_followed_projects}
              title={
                <Typography variant="h1" color="primary">
                  Dashboard
                </Typography>
              }
            />
          </Page>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default DashboardView;
