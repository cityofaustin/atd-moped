import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
import ProjectSummaryDetails from "./ProjectSummaryDetails";
import ProjectComments from "./projectView/Comments/ProjectComments";
import { SUMMARY_QUERY, TEAM_QUERY } from "src/queries/project.js";
import PropTypes from "prop-types";
import {
  Button,
  Box,
  Container,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  AppBar,
  Tab,
  Tabs,
  Typography,
  Grid,
  CardActions,
} from "@material-ui/core";
import {
  // rest of the elements/components imported remain same
  useParams,
} from "react-router-dom";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProjectSummary = () => {
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

  const { loading: teamLoading, error: teamError, data: teamData } = useQuery(
    TEAM_QUERY
  );

  if (projectError) return `Error! ${projectError.message}`;
  if (teamError) return `Error! ${teamError.message}`;

  return (
    <Page title="Project Summary Page">
      <Container>
        <Card className={classes.cardWrapper}>
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
                aria-label="simple tabs example"
              >
                <Tab label="Summary" {...a11yProps(0)} />
                <Tab label="Team" {...a11yProps(1)} />
                <Tab label="Timeline" {...a11yProps(2)} />
                <Tab label="Comments" {...a11yProps(3)} />
                <Tab label="Activity Log" {...a11yProps(4)} />
              </Tabs>
            </AppBar>
            <TabPanel value={activeTab} index={0}>
              <CardContent>
                {projectLoading ? (
                  <CircularProgress />
                ) : (
                  <ProjectSummaryDetails
                    details={projectData.moped_project[0]}
                  />
                )}
              </CardContent>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {teamLoading ? (
                <CircularProgress />
              ) : (
                <Grid container>
                  {teamData.moped_proj_personnel.map(detail => (
                    <h6 key={detail.first_name} value={detail.first_name}>
                      {detail.first_name} {detail.last_name}
                    </h6>
                  ))}
                </Grid>
              )}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              TBD
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <ProjectComments />
            </TabPanel>
            <TabPanel value={activeTab} index={4}>
              TBD
            </TabPanel>
          </div>
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

export default ProjectSummary;
