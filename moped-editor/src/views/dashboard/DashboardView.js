import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { NavLink as RouterLink } from "react-router-dom";

// Material
import {
  AppBar,
  Box,
  Card,
  Container,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import theme from "src/theme";

import Page from "src/components/Page";
import ActivityMetrics from "src/components/ActivityMetrics";
import DashboardStatusModal from "src/views/dashboard/DashboardStatusModal";
import DashboardTimelineModal from "src/views/dashboard/DashboardTimelineModal";
import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";
import MilestoneProgressMeter from "src/views/dashboard/MilestoneProgressMeter";
import FeedbackSnackbar, {
  useFeedbackSnackbar,
} from "src/components/FeedbackSnackbar";
import UserSavedViewsTable from "src/views/dashboard/UserSavedViewsTable";
import { DataGridPro } from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { getTimeOfDay, getCalendarDate } from "src/utils/dateAndTime";
import { formatRelativeDate } from "src/utils/dateAndTime";

import { DASHBOARD_QUERY } from "src/queries/dashboard";

import { useSessionDatabaseData } from "src/auth/user";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TABS = [
  {
    label: "My projects",
  },
  {
    label: "Following",
  },
  {
    label: "Saved views",
  },
];

const UserGreeting = ({ userName }) => {
  const date = new Date();
  const timeOfDay = getTimeOfDay(date);

  return (
    <Grid sx={{ display: "block" }}>
      <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>
        Good {timeOfDay}, {userName}!
      </Typography>
      <Typography variant="h1" sx={{ paddingTop: theme.spacing(0.5) }}>
        {getCalendarDate(date)}
      </Typography>
    </Grid>
  );
};

// Reusable styles for table cells
const tableCellStyles = {
  display: "flex",
  alignItems: "center",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
};

// Helper function to calculate milestone completion percentage
const calculateMilestonePercentage = (milestones) => {
  if (!milestones || milestones.length === 0) return 0;
  const completedCount = milestones.filter(
    (milestone) => milestone.completed === true
  ).length;
  return (completedCount / milestones.length) * 100;
};

const useColumns = ({ data, refetch, handleSnackbar }) => {
  return useMemo(() => {
    return [
      {
        headerName: "ID",
        field: "project_id",
        editable: false,
        renderCell: ({ row }) => (
          <div style={tableCellStyles}>{row.project_id}</div>
        ),
        flex: 0.5,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: false,
        valueGetter: (value) => value.trim(),
        renderCell: ({ row }) => (
          <div style={tableCellStyles}>
            <Link
              component={RouterLink}
              to={`/moped/projects/${row.project_id}`}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                fontSize: 16,
              }}
            >
              {row.project_name_full}
            </Link>
          </div>
        ),
        flex: 4,
      },
      {
        headerName: "Status",
        field: "moped_proj_phases",
        editable: false,
        valueGetter: (value) => value[0]?.moped_phase.phase_name || "Unknown",
        renderCell: ({ row }) => (
          <div style={tableCellStyles}>
            <DashboardTimelineModal
              table="phases"
              projectId={row.project_id}
              projectName={row.project_name_full}
              dashboardRefetch={refetch}
              handleSnackbar={handleSnackbar}
            >
              <ProjectStatusBadge
                phaseName={row.moped_proj_phases?.[0]?.moped_phase.phase_name}
                phaseKey={row.moped_proj_phases?.[0]?.moped_phase.phase_key}
                condensed
                clickable
              />
            </DashboardTimelineModal>
          </div>
        ),
        width: 200,
      },
      {
        headerName: "Status update",
        field: "moped_proj_notes",
        editable: false,
        sortable: false,
        renderCell: ({ row }) => {
          // Display status update (from Project details page), i.e., most recent note
          const statusUpdate =
            row.project_list_view?.project_status_update ?? "";
          const author = row.project_list_view?.project_status_update_author;
          const dateCreated = formatRelativeDate(
            row.project_list_view?.project_status_update_date_created
          );

          return (
            <div style={tableCellStyles}>
              <DashboardStatusModal
                projectId={row.project_id}
                eCaprisSubprojectId={row.ecapris_subproject_id}
                projectName={row.project_name_full}
                currentPhaseId={
                  row.moped_proj_phases?.[0]?.moped_phase.phase_id
                }
                modalParent="dashboard"
                statusUpdate={statusUpdate}
                queryRefetch={refetch}
                handleSnackbar={handleSnackbar}
                // ProjectNotes will expect data to be passed in this shape with note type lookups
                data={{
                  moped_project: [row],
                  moped_note_types: data.moped_note_types,
                }}
                statusUpdateAuthor={author}
                statusUpdateDateCreated={dateCreated}
              />
            </div>
          );
        },
        flex: 4,
      },
      {
        headerName: "Milestones",
        field: "moped_proj_milestones",
        valueGetter: (value) => {
          return calculateMilestonePercentage(value);
        },
        renderCell: ({ row }) => {
          const percentage = calculateMilestonePercentage(
            row.moped_proj_milestones
          );

          // Display percentage of milestone completed, or 0 if no milestones saved
          return (
            <div style={tableCellStyles}>
              <DashboardTimelineModal
                table="milestones"
                projectId={row.project_id}
                projectName={row.project_name_full}
                handleSnackbar={handleSnackbar}
                dashboardRefetch={refetch}
              >
                <MilestoneProgressMeter
                  completedMilestonesPercentage={percentage}
                />
              </DashboardTimelineModal>
            </div>
          );
        },
        flex: 1,
      },
    ];
  }, [data, refetch, handleSnackbar]);
};

const DashboardView = () => {
  const userSessionData = useSessionDatabaseData();
  const userId = userSessionData?.user_id;
  const userName = userSessionData?.first_name;

  const { loading, error, data, refetch } = useQuery(DASHBOARD_QUERY, {
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  const { snackbarState, handleSnackbar, handleSnackbarClose } =
    useFeedbackSnackbar();

  if (error) {
    console.log(error);
  }

  const [activeTab, setActiveTab] = useState(0);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  // sets the data grid row data when query data is fetched
  useEffect(() => {
    if (data) {
      if (TABS[activeTab].label === "My projects") {
        setRows(data.moped_proj_personnel.map((row) => row.project));
      }
      if (TABS[activeTab].label === "Following") {
        setRows(data.moped_user_followed_projects.map((row) => row.project));
      }
    }
  }, [data, activeTab]);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    refetch,
    handleSnackbar,
  });

  return (
    <ActivityMetrics eventName="dashboard_load">
      <Page title={"Dashboard"}>
        <Container maxWidth="xl">
          <Card sx={{ marginTop: 3 }}>
            <Grid
              sx={{
                flexGrow: 1,
                backgroundColor: "background.paper",
              }}
            >
              <Box pl={3} pt={3}>
                <UserGreeting userName={userName} />
              </Box>
              <Box px={3} py={3}>
                <Grid>
                  <AppBar
                    sx={{
                      backgroundColor: "background.paper",
                      color: "text.secondary",
                    }}
                    position="static"
                  >
                    <Tabs
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "primary.light",
                        },
                      }}
                      value={activeTab}
                      onChange={handleChange}
                    >
                      {TABS.map((tab, i) => {
                        return (
                          <Tab
                            sx={{
                              "&.Mui-selected": {
                                color: "text.primary",
                              },
                            }}
                            key={tab.label}
                            label={tab.label}
                            {...a11yProps(i)}
                          />
                        );
                      })}
                    </Tabs>
                  </AppBar>
                  {TABS[activeTab].label === "Saved views" ? (
                    <UserSavedViewsTable handleSnackbar={handleSnackbar} />
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <DataGridPro
                        sx={dataGridProStyleOverrides}
                        columns={dataGridColumns}
                        rows={rows || []}
                        loading={loading || !data}
                        getRowHeight={() => "auto"}
                        getRowId={(row) => row.project_id}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        hideFooter
                        disableRowSelectionOnClick
                        localeText={{
                          noRowsLabel: "No projects to display",
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Card>
        </Container>
        <FeedbackSnackbar
          snackbarState={snackbarState}
          handleSnackbarClose={handleSnackbarClose}
        />
      </Page>
    </ActivityMetrics>
  );
};

export default DashboardView;
