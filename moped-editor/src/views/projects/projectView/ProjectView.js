import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link as RouterLink, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import {
  Button,
  Box,
  Container,
  Card,
  Divider,
  CircularProgress,
  AppBar,
  Tab,
  Tabs,
  Typography,
  CardActions,
} from "@material-ui/core";

import Page from "src/components/Page";
import ProjectSummary from "./ProjectSummary";
import ProjectTeam from "./ProjectTeam";
import ProjectTabPlaceholder from "./ProjectTabPlaceholder";
import TabPanel from "./TabPanel";
import { SUMMARY_QUERY } from "../../../queries/projects/projectSummaryQuery";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProjectView = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const {
    loading: projectLoading,
    error: projectError,
    data: projectData,
  } = useQuery(SUMMARY_QUERY, {
    variables: { projectId },
  });

  if (projectError) return `Error! ${projectError.message}`;

  const TABS = [
    { label: "Summary", Component: ProjectSummary },
    { label: "Team", Component: ProjectTeam },
    { label: "Timeline", Component: ProjectTabPlaceholder },
    { label: "Notes", Component: ProjectTabPlaceholder },
    { label: "Summary", Component: ProjectTabPlaceholder },
    { label: "Activity Log", Component: ProjectTabPlaceholder },
  ];

  return (
    <Page title="Project Summary Page">
      <Container>
        <Card className={classes.cardWrapper}>
          {projectLoading ? (
            <CircularProgress />
          ) : (
            <div className={classes.root}>
              {projectLoading ? (
                <CircularProgress />
              ) : (
                <Box p={4} pb={2}>
                  <Typography color="textPrimary" variant="h2">
                    {projectData.moped_project[0].project_name}
                  </Typography>
                </Box>
              )}
              <Divider />
              <AppBar position="static">
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  aria-label="Project Details Tabs"
                >
                  {TABS.map((tab, i) => {
                    return <Tab label={tab.label} {...a11yProps(i)} />;
                  })}
                </Tabs>
              </AppBar>
              {TABS.map((tab, i) => {
                const TabComponent = tab.Component;
                return (
                  <TabPanel value={activeTab} index={i}>
                    <TabComponent details={projectData.moped_project[0]} />
                  </TabPanel>
                );
              })}
            </div>
          )}
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button
              className={classes.button}
              component={RouterLink}
              to="/moped/projects"
            >
              All Projects
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectView;
