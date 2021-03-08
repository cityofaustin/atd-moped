import React from "react";
import { useQuery } from "@apollo/client";
import { Link as RouterLink, useParams, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
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
  CardActions,
} from "@material-ui/core";

import Page from "src/components/Page";
import ProjectSummary from "./ProjectSummary";
import ProjectTeam from "./ProjectTeam";
import ProjectTimeline from "./ProjectTimeline";
import ProjectTabPlaceholder from "./ProjectTabPlaceholder";
import TabPanel from "./TabPanel";
import { PROJECT_NAME } from "../../../queries/project";
import ProjectActivityLog from "./ProjectActivityLog";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectNameEditable from "./ProjectNameEditable";

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

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const TABS = [
  { label: "Summary", Component: ProjectSummary, param: "summary" },
  { label: "Team", Component: ProjectTeam, param: "team" },
  { label: "Timeline", Component: ProjectTimeline, param: "timeline" },
  { label: "Notes", Component: ProjectTabPlaceholder, param: "notes" },
  {
    label: "Activity Log",
    Component: ProjectActivityLog,
    param: "activity_log",
  },
];

const history = createBrowserHistory();

const ProjectView = () => {
  const { projectId } = useParams();
  let query = useQueryParams();
  const classes = useStyles();

  // Get the tab query string value and associated tab index.
  // If there's no query string, default to first tab in TABS array
  let activeTabIndex = !!query.get("tab")
    ? TABS.findIndex(tab => tab.param === query.get("tab"))
    : 0;

  const [activeTab, setActiveTab] = React.useState(activeTabIndex);

  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
    history.push(`/moped/projects/${projectId}?tab=${TABS[newTab].param}`);
  };

  const { loading, error, data } = useQuery(PROJECT_NAME, {
    variables: { projectId },
  });

  return (
    <ApolloErrorHandler error={error}>
      <Page title="Project Summary Page">
        <Container maxWidth="xl">
          <Card className={classes.cardWrapper}>
            {loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.root}>
                <Box p={4} pb={2}>
                  <ProjectNameEditable
                    projectName={data.moped_project[0].project_name}
                    projectId={projectId}
                    editable={true}
                  />
                </Box>
                <Divider />
                <AppBar position="static">
                  <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="Project Details Tabs"
                  >
                    {TABS.map((tab, i) => {
                      return (
                        <Tab
                          key={tab.label}
                          label={tab.label}
                          {...a11yProps(i)}
                        />
                      );
                    })}
                  </Tabs>
                </AppBar>
                {TABS.map((tab, i) => {
                  const TabComponent = tab.Component;
                  return (
                    <TabPanel key={tab.label} value={activeTab} index={i}>
                      <TabComponent />
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
    </ApolloErrorHandler>
  );
};

export default ProjectView;
