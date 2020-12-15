import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link as RouterLink } from "react-router-dom";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
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
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const SUMMARY_QUERY = gql`
  query ProjectSummary($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
      project_description
      start_date
      current_phase
      current_status
      eCapris_id
      fiscal_year
      project_priority
    }
  }
`;

const TEAM_QUERY = gql`
  query TeamSummary {
    moped_proj_personnel(limit: 2, order_by: { project_personnel_id: desc }) {
      first_name
      last_name
      role_name
      notes
    }
  }
`;

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {
    loading: projectLoading,
    error: projectError,
    data: projectData,
  } = useQuery(SUMMARY_QUERY, {
    variables: { projectId },
  });

  if (projectError) {
    console.log(projectError);
  }

  const { loading: teamLoading, error: teamError, data: teamData } = useQuery(
    TEAM_QUERY
  );

  if (projectLoading) return <CircularProgress />;
  if (projectError) return `Error! ${projectError.message}`;

  if (teamLoading) return <CircularProgress />;
  if (teamError) return `Error! ${teamError.message}`;

  return (
    <Page title="Success Page">
      <Container>
        <Card className={classes.cardWrapper}>
          <div className={classes.root}>
            <Box pt={2} pl={2}>
              {projectData.moped_project.map(details => (
                <h2 key={details.project_name} value={details.project_name}>
                  {details.project_name}
                </h2>
              ))}
            </Box>
            <Divider />
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                <Tab label="Summary" disabled {...a11yProps(0)} />
                <Tab label="Team" {...a11yProps(1)} />
                <Tab label="Timeline" {...a11yProps(2)} />
                <Tab label="Notes" {...a11yProps(3)} />
                <Tab label="Activity Log" {...a11yProps(4)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={1}>
              {teamData.moped_proj_personnel.map(detail => (
                <h6 key={detail.first_name} value={detail.first_name}>
                  {detail.first_name} {detail.last_name}
                </h6>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2}>
              TBD
            </TabPanel>
            <TabPanel value={value} index={3}>
              TBD
            </TabPanel>
            <TabPanel value={value} index={4}>
              TBD
            </TabPanel>
          </div>
          <Divider />
          <CardContent>
            <Grid container spacing={3} style={{ margin: 20 }}>
              <Grid item xs={4}>
                <h4>Current Status</h4>
                {projectData.moped_project.map(details => (
                  <p
                    key={details.current_status}
                    value={details.current_status}
                  >
                    {details.current_status}
                  </p>
                ))}
              </Grid>
              <Grid item xs={4}>
                <h4>Current Phase</h4>
                {projectData.moped_project.map(details => (
                  <p key={details.current_phase} value={details.current_phase}>
                    {details.current_phase}
                  </p>
                ))}
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ margin: 20 }}>
              <Grid item xs={12}>
                <h4>Description</h4>
                {projectData.moped_project.map(details => (
                  <p
                    key={details.project_description}
                    value={details.project_description}
                  >
                    {details.project_description}
                  </p>
                ))}
                <h4>Start Date</h4>
                {projectData.moped_project.map(details => (
                  <p key={details.start_date} value={details.start_date}>
                    {details.start_date}
                  </p>
                ))}
                <h4>Fiscal Year</h4>
                {projectData.moped_project.map(details => (
                  <p key={details.fiscal_year} value={details.fiscal_year}>
                    {details.fiscal_year}
                  </p>
                ))}
                <h4>Priority</h4>
                {projectData.moped_project.map(details => (
                  <p
                    key={details.project_priority}
                    value={details.project_priority}
                  >
                    {details.project_priority}
                  </p>
                ))}
                <h4>eCaprisId</h4>
                {projectData.moped_project.map(details => (
                  <p key={details.eCapris_id} value={details.eCapris_id}>
                    {details.eCapris_id}
                  </p>
                ))}
              </Grid>
            </Grid>
          </CardContent>
          <div>
            <Divider />
            <Box pt={2} pl={2} className={classes.buttons}>
              <Button
                className={classes.button}
                component={RouterLink}
                to="/moped/projects"
              >
                All Projects
              </Button>
            </Box>
          </div>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectSummary;
