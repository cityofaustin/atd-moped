import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";

// Material
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import { makeStyles } from "@material-ui/core/styles";

import Page from "src/components/Page";

import RenderFieldLink from "../projects/signalProjectTable/RenderFieldLink";
import DashboardEditModal from "./DashboardEditModal";
import DashboardTimelineModal from "./DashboardTimelineModal";
import ProjectStatusBadge from "../projects/projectView/ProjectStatusBadge";
import MilestoneProgressMeter from "./MilestoneProgressMeter";

import typography from "../../theme/typography";

import TrafficIcon from "@material-ui/icons/Traffic";

import { DASHBOARD_QUERY } from "../../queries/dashboard";

import { getSessionDatabaseData } from "../../auth/user";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.header,
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
];

const DashboardView = () => {
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData?.user_id;
  const userName = userSessionData?.first_name;

  const classes = useStyles();
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const [activeTab, setActiveTab] = useState(0);

  const { loading, error, data, refetch } = useQuery(DASHBOARD_QUERY, {
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  if (error) {
    console.log(error);
  }

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
      project["project_name"] = project.project.project_name;
      project["project_id"] = project.project.project_id;
      project["current_phase"] = project.project.current_phase;
      project["current_status"] = project.project.current_status;
      project["status_id"] = project.project.status_id;

      /**
       * Get percentage of milestones completed
       */
      const milestonesTotal = project.project.moped_proj_milestones.length;
      const milestonesCompleted = project.project.moped_proj_milestones.filter(
        (milestone) => milestone.completed === true
      ).length;
      project["completed_milestones_percentage"] = !!milestonesTotal
        ? (milestonesCompleted / milestonesTotal) * 100
        : 0;

      // project status update equivalent to most recent project note
      // html is parsed before being rendered in the DashboardEditModal component
      project["status_update"] = "";
      if (project?.project?.moped_proj_notes?.length) {
        const note = project.project.moped_proj_notes[0]["project_note"];
        project["status_update"] = note ? note : "";
      }
    });
  }

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

  const columns = [
    {
      title: "Project name",
      field: "project.project_name",
      editable: "never",
      cellStyle: { ...typographyStyle },
      render: (entry) => (
        <RenderFieldLink
          projectId={entry.project_id}
          value={entry.project_name}
        />
      ),
      width: "25%",
    },
    {
      title: "Status",
      field: "current_phase",
      editable: "never",
      render: (entry) => (
        <DashboardTimelineModal
          table="phases"
          projectId={entry.project_id}
          projectName={entry.project.project_name}
          queryRefetch={refetch}
          contents={
            <ProjectStatusBadge
              status={entry.status_id}
              phase={entry.current_phase}
              projectStatuses={data?.moped_status ?? []}
              condensed
              clickable
            />
          }
        />
      ),
      width: "25%",
    },
    {
      title: "Status update",
      field: "status_update", // Status update (from Project details page)
      editable: "never",
      render: (entry) => (
        <DashboardEditModal
          project={entry.project}
          displayText={entry.status_update}
          queryRefetch={refetch}
        />
      ),
      width: "25%",
    },
    {
      title: "Milestones completed",
      field: "completed_milestones",
      render: (entry) => (
        <DashboardTimelineModal
          table="milestones"
          projectId={entry.project_id}
          projectName={entry.project.project_name}
          queryRefetch={refetch}
          contents={
            <MilestoneProgressMeter
              completedMilestonesPercentage={
                entry.completed_milestones_percentage
              }
            />
          }
        />
      ),
      width: "25%",
    },
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Page title={"Dashboard"}>
      <Container maxWidth="xl">
        <Card className={classes.cardWrapper}>
          <Grid className={classes.root}>
            <Box pl={3} pt={3}>
              <Grid className={classes.greeting}>
                <Typography className={classes.greetingText}>
                  <strong>{`Good ${getTimeOfDay(curHr)}, ${userName}!`}</strong>
                </Typography>
                <Typography variant="h1" className={classes.date}>
                  {dateFormatted}
                </Typography>
              </Grid>
            </Box>
            <Box px={3} pt={3}>
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
                ) : (
                  <MaterialTable
                    columns={columns}
                    data={selectedData}
                    localization={{
                      body: {
                        emptyDataSourceMessage: (
                          <Typography>
                            {TABS[activeTab].label === "Following" &&
                              "No projects to display. You have not followed any current projects."}
                            {TABS[activeTab].label === "My projects" &&
                              "No projects to display. You are not listed as a Team Member on any current projects."}
                          </Typography>
                        ),
                      },
                    }}
                    options={{
                      search: false,
                      toolbar: false,
                      tableLayout: "fixed",
                    }}
                  />
                )}
              </Grid>
            </Box>
            <Box px={3} pb={3}>
              <Card className={classes.cardWrapper}>
                <CardContent>
                  <Grid className={classes.cardTitle}>
                    <Typography variant="h3" color="primary">
                      Views
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Link href="/moped/views/signal-projects" noWrap>
                      <Card>
                        <CardContent className={classes.viewsCard}>
                          <Grid item xs={4}>
                            <TrafficIcon />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>Signal Projects</Typography>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
};

export default DashboardView;
