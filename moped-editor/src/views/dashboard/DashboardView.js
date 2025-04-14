import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";

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
  /** Build custom user greeting
   */
  const date = new Date();
  const curHr = format(date, "HH");
  const dateFormatted = format(date, "EEEE - LLLL dd, yyyy");
  const getTimeOfDay = (curHr) => {
    switch (true) {
      case curHr < 12:
        return "morning";
      case curHr >= 12 && curHr < 18:
        return "afternoon";
      default:
        return "evening";
    }
  };

  return (
    <Grid className={classes.greeting}>
      <Typography className={classes.greetingText}>
        <strong>{`Good ${getTimeOfDay(curHr)}, ${userName}!`}</strong>
      </Typography>
      <Typography variant="h1" className={classes.date}>
        {dateFormatted}
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
        flex: 0.5,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: false,
        renderCell: ({ row }) => (
          <Link
            href={`/moped/projects/${row.id}`}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {row.project_name_full}
          </Link>
        ),
        flex: 4,
      },
      {
        headerName: "Status",
        field: "phase_name",
        editable: false,
        renderCell: ({ row }) => (
          <DashboardTimelineModal
            table="phases"
            projectId={row.project_id}
            projectName={row.project.project_name_full}
            dashboardRefetch={refetch}
            handleSnackbar={handleSnackbar}
          >
            <ProjectStatusBadge
              phaseName={row.phase_name}
              phaseKey={row.phase_key}
              condensed
              clickable
            />
          </DashboardTimelineModal>
        ),
        flex: 2,
      },
      {
        headerName: "Status update",
        field: "status_update", // Status update (from Project details page)
        editable: false,
        renderCell: ({ row }) => (
          <DashboardStatusModal
            projectId={row.project_id}
            projectName={row.project_name_full}
            currentPhaseId={row.current_phase_id}
            modalParent="dashboard"
            statusUpdate={row.status_update}
            queryRefetch={refetch}
            handleSnackbar={handleSnackbar}
            classes={classes}
          >
            {parse(String(row.status_update))}
          </DashboardStatusModal>
        ),
        flex: 4,
      },
      {
        headerName: "Milestones",
        field: "completed_milestones_percentage",
        renderCell: ({ row }) => (
          <DashboardTimelineModal
            table="milestones"
            projectId={row.project_id}
            projectName={row.project.project_name_full}
            handleSnackbar={handleSnackbar}
            dashboardRefetch={refetch}
          >
            <MilestoneProgressMeter
              completedMilestonesPercentage={
                row.completed_milestones_percentage
              }
            />
          </DashboardTimelineModal>
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
    let selectedData = [];

    if (TABS[activeTab].label === "Following" && !!data) {
      selectedData = data.moped_user_followed_projects;
    } else if (TABS[activeTab].label === "My projects" && !!data) {
      selectedData = data.moped_proj_personnel;
    }

    if (selectedData) {
      /**
       * Build data needed in Dashboard Material Table
       */
      selectedData.forEach((project) => {
        project["project_name_full"] = project.project.project_name_full;
        project["project_id"] = project.project.project_id;
        project["phase_name"] =
          project.project.moped_proj_phases?.[0]?.moped_phase.phase_name;
        project["phase_key"] =
          project.project.moped_proj_phases?.[0]?.moped_phase.phase_key;
        project["current_phase_id"] =
          project.project.moped_proj_phases?.[0]?.moped_phase.phase_id;
        /**
         * Get percentage of milestones completed
         */
        const milestonesTotal = project.project.moped_proj_milestones.length;
        const milestonesCompleted =
          project.project.moped_proj_milestones.filter(
            (milestone) => milestone.completed === true
          ).length;
        project["completed_milestones_percentage"] = !!milestonesTotal
          ? (milestonesCompleted / milestonesTotal) * 100
          : 0;

        project["id"] = project.project.project_id;

        // project status update equivalent to most recent project note
        // html is parsed before being rendered in the DashboardStatusModal component
        project["status_update"] = "";
        if (project?.project?.moped_proj_notes?.length) {
          const note = project.project.moped_proj_notes[0]["project_note"];
          project["status_update"] = note ? note : "";
        }
      });
    }
    if (data) {
      setRows(selectedData);
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
                <UserGreeting classes={classes} userName={userName}/>
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
                      getRowId={(row) => row.id}
                      rowModesModel={rowModesModel}
                      onRowModesModelChange={handleRowModesModelChange}
                      onProcessRowUpdateError={(error) => console.error}
                      editMode="row"
                      hideFooter
                      disableRowSelectionOnClick
                      localeText={{
                        noRowsLabel: "No projects to display",
                      }}
                      initialState={{ pinnedColumns: { right: ["edit"] } }}
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
