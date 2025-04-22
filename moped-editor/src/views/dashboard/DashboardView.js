import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { NavLink as RouterLink } from "react-router-dom";

// Material
import {
  AppBar,
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import Page from "src/components/Page";
import ActivityMetrics from "src/components/ActivityMetrics";
import DashboardStatusModal from "./DashboardStatusModal";
import DashboardTimelineModal from "./DashboardTimelineModal";
import ProjectStatusBadge from "../projects/projectView/ProjectStatusBadge";
import MilestoneProgressMeter from "./MilestoneProgressMeter";
import FeedbackSnackbar, {
  useFeedbackSnackbar,
} from "src/components/FeedbackSnackbar";
import UserSavedViewsTable from "./UserSavedViewsTable";
import { DataGridPro } from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { getTimeOfDay, getCalendarDate } from "src/utils/dateAndTime";

import { DASHBOARD_QUERY } from "../../queries/dashboard";

import { getSessionDatabaseData } from "../../auth/user";

import parse from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
  },
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  selectedTab: {
    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  },
  indicatorColor: {
    backgroundColor: theme.palette.primary.light,
  },
  viewsCard: {
    display: "inline-flex",
    padding: "24px",
  },
  cardTitle: {
    paddingBottom: "16px",
  },
  greeting: {
    display: "block",
  },
  greetingText: {
    color: theme.palette.text.secondary,
  },
  date: {
    paddingTop: "4px",
  },
  statusUpdateText: {
    cursor: "pointer",
  },
  tooltipIcon: {
    fontSize: "20px",
  },
  tableRowDiv: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

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

const UserGreeting = ({ classes, userName }) => {
  const date = new Date();

  /** Build custom user greeting
   */
  return (
    <Grid className={classes.greeting}>
      <Typography className={classes.greetingText}>
        <strong>{`Good ${getTimeOfDay(date)}, ${userName}!`}</strong>
      </Typography>
      <Typography variant="h1" className={classes.date}>
        {getCalendarDate(date)}
      </Typography>
    </Grid>
  );
};

/** Hook that provides memoized column settings */
const useColumns = ({ refetch, handleSnackbar, classes }) =>
  useMemo(() => {
    return [
      {
        headerName: "ID",
        field: "project_id",
        editable: false,
        renderCell: ({ row }) => (
          <div className={classes.tableRowDiv}>{row.project.project_id}</div>
        ),
        flex: 0.5,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: false,
        renderCell: ({ row }) => (
          <div className={classes.tableRowDiv}>
            <Link
              component={RouterLink}
              to={`/moped/projects/${row.project.project_id}`}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                fontSize: 16,
              }}
            >
              {row.project.project_name_full}
            </Link>
          </div>
        ),
        flex: 4,
      },
      {
        headerName: "Status",
        field: "phase_name",
        editable: false,
        renderCell: ({ row }) => (
          <div className={classes.tableRowDiv}>
            <DashboardTimelineModal
              table="phases"
              projectId={row.project.project_id}
              projectName={row.project.project_name_full}
              dashboardRefetch={refetch}
              handleSnackbar={handleSnackbar}
            >
              <ProjectStatusBadge
                phaseName={
                  row.project.moped_proj_phases?.[0]?.moped_phase.phase_name
                }
                phaseKey={
                  row.project.moped_proj_phases?.[0]?.moped_phase.phase_key
                }
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
        field: "status_update",
        editable: false,
        renderCell: ({ row }) => (
          // Display status update (from Project details page), i.e., most recent note
          <div className={classes.tableRowDiv}>
            <DashboardStatusModal
              projectId={row.project.project_id}
              projectName={row.project.project_name_full}
              currentPhaseId={
                row.project.moped_proj_phases?.[0]?.moped_phase.phase_id
              }
              modalParent="dashboard"
              statusUpdate={
                row.project.moped_proj_notes?.[0]?.project_note ?? ""
              }
              queryRefetch={refetch}
              handleSnackbar={handleSnackbar}
              classes={classes}
            >
              {parse(
                String(row.project.moped_proj_notes?.[0]?.project_note ?? "")
              )}
            </DashboardStatusModal>
          </div>
        ),
        flex: 4,
      },
      {
        headerName: "Milestones",
        field: "completed_milestones_percentage",
        renderCell: ({ row }) => (
          // Display percentage of milestone completed, or 0 if no milestones saved
          <div className={classes.tableRowDiv}>
            <DashboardTimelineModal
              table="milestones"
              projectId={row.project.project_id}
              projectName={row.project.project_name_full}
              handleSnackbar={handleSnackbar}
              dashboardRefetch={refetch}
            >
              <MilestoneProgressMeter
                completedMilestonesPercentage={
                  row.project.moped_proj_milestones.length
                    ? (row.project.moped_proj_milestones.filter(
                        (milestone) => milestone.completed === true
                      ).length /
                        row.project.moped_proj_milestones.length) *
                      100
                    : 0
                }
              />
            </DashboardTimelineModal>
          </div>
        ),
        flex: 1,
      },
    ];
  }, [refetch, handleSnackbar, classes]);

const DashboardView = () => {
  const classes = useStyles();

  const userSessionData = getSessionDatabaseData();
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
        setRows(data.moped_proj_personnel);
      }
      if (TABS[activeTab].label === "Following") {
        setRows(data.moped_user_followed_projects);
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
    classes,
  });

  if (loading || !data) return <CircularProgress />;

  return (
    <ActivityMetrics eventName="dashboard_load">
      <Page title={"Dashboard"}>
        <Container maxWidth="xl">
          <Card className={classes.cardWrapper}>
            <Grid className={classes.root}>
              <Box pl={3} pt={3}>
                <UserGreeting classes={classes} userName={userName} />
              </Box>
              <Box px={3} py={3}>
                <Grid>
                  <AppBar className={classes.appBar} position="static">
                    <Tabs
                      classes={{ indicator: classes.indicatorColor }}
                      value={activeTab}
                      onChange={handleChange}
                    >
                      {TABS.map((tab, i) => {
                        return (
                          <Tab
                            className={classes.selectedTab}
                            key={tab.label}
                            label={tab.label}
                            {...a11yProps(i)}
                          />
                        );
                      })}
                    </Tabs>
                  </AppBar>
                  {loading ? (
                    <CircularProgress />
                  ) : TABS[activeTab].label === "Saved views" ? (
                    <UserSavedViewsTable handleSnackbar={handleSnackbar} />
                  ) : (
                    <DataGridPro
                      sx={dataGridProStyleOverrides}
                      columns={dataGridColumns}
                      rows={rows}
                      autoHeight
                      getRowHeight={() => "auto"}
                      getRowId={(row) => row.project.project_id}
                      rowModesModel={rowModesModel}
                      onRowModesModelChange={handleRowModesModelChange}
                      hideFooter
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: "No projects to display",
                      }}
                    />
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
