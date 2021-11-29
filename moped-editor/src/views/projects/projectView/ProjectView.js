import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link as RouterLink, useParams, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import { makeStyles } from "@material-ui/core/styles";

import KnackSync from "./KnackSync";

import {
  Breadcrumbs,
  Link,
  Button,
  Box,
  Container,
  Card,
  Divider,
  CircularProgress,
  AppBar,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Menu,
  MenuItem,
  Fade,
  Icon,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import Page from "src/components/Page";
import ProjectSummary from "./ProjectSummary/ProjectSummary";
import ProjectComponents from "./ProjectComponents";
import ProjectFunding from "./ProjectFunding";
import ProjectTeam from "./ProjectTeam";
import ProjectTimeline from "./ProjectTimeline";
import ProjectComments from "./ProjectComments";
import ProjectFiles from "./ProjectFiles";
import TabPanel from "./TabPanel";
import { PROJECT_ARCHIVE, SUMMARY_QUERY } from "../../../queries/project";
import ProjectActivityLog from "./ProjectActivityLog";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectNameEditable from "./ProjectNameEditable";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  noPadding: {
    padding: 0,
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
  title: {
    height: "3rem",
  },
  moreHorizontal: {
    fontSize: "2rem",
    float: "right",
    cursor: "pointer",
  },
  menuDangerItem: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
  },
  menuDangerText: {
    color: theme.palette.common.white,
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.header,
  },
  selectedTab: {
    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  },
  indicatorColor: {
    backgroundColor: theme.palette.primary.light,
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
  { label: "Map", Component: ProjectComponents, param: "map" },
  { label: "Timeline", Component: ProjectTimeline, param: "timeline" },
  { label: "Team", Component: ProjectTeam, param: "team" },
  { label: "Funding", Component: ProjectFunding, param: "funding" },
  { label: "Comments", Component: ProjectComments, param: "comments" },
  { label: "Files", Component: ProjectFiles, param: "files" },
  {
    label: "Activity Log",
    Component: ProjectActivityLog,
    param: "activity_log",
  },
];

const history = createBrowserHistory();

/**
 * The project summary view
 * @return {JSX.Element}
 * @constructor
 */
const ProjectView = () => {
  const { projectId } = useParams();
  let query = useQueryParams();
  const classes = useStyles();
  const previousFilters = useLocation()?.state?.filters;
  const allProjectsLink = !!previousFilters
    ? `/moped/projects?filter=${previousFilters}`
    : "/moped/projects";

  // Get the tab query string value and associated tab index.
  // If there's no query string, default to first tab in TABS array
  let activeTabIndex = !!query.get("tab")
    ? TABS.findIndex(tab => tab.param === query.get("tab"))
    : 0;

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: "Default State",
    severity: "warning",
  };

  /**
   * @constant {int} activeTab - The number of the active tab
   * @constant {boolean} isEditing - When true, it signals a child component we want to edit the project name
   * @constant {boolean} dialogOpen - When true, the dialog shows
   * @constant {dict} dialogState - Contains the 'title', 'body' and 'actions' as either string or JSX
   * @constant {JSX} anchorElement - The element our 'MoreHorizontal' menu anchors to.
   * @constant {object} snackbarState - The current state of the snackbar's configuration
   * @constant {boolean} menuOpen - If true, it shows the menu component. Immutable.
   */
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const menuOpen = anchorElement ?? false;

  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  /**
   * Function which can be passed to child component to allow it to invoke a snackbar which
   * will persist even after that child component has been deconstructed or otherwise hidden.
   */
  const handleSnackbarOpen = snackbarState => {
    let snackbarStateCopy = {...snackbarState};
    snackbarStateCopy.open = true;
    setSnackbarState(snackbarStateCopy);
  };

  /**
   * Handles the click on a tab, which should trigger a change.
   * @param {Object} event - The click event
   * @param {int} newTab - The number of the tab
   */
  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
    history.push(`/moped/projects/${projectId}?tab=${TABS[newTab].param}`);
  };

  /**
   * The query to gather the project summary data
   */
  const { loading, error, data, refetch } = useQuery(SUMMARY_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  /**
   * The mutation to soft-delete the project
   */
  const [archiveProject] = useMutation(PROJECT_ARCHIVE, {
    variables: { projectId },
  });

  /**
   * Clears the dialog contents
   */
  const clearDialogContent = () => {
    setDialogState(null);
  };

  /**
   * Changes the dialog contents
   * @param {string|JSX} title - The title of the dialog
   * @param {string|JSX} body - The body of the dialog
   * @param {string|JSX} actions - The buttons area for the dialog at the bottom
   */
  const setDialogContent = (title, body, actions) => {
    setDialogState({
      title: title,
      body: body,
      actions: actions,
    });
  };

  /**
   * Opens the dialog
   */
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  /**
   * Closes the dialog, and clears its contents
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    clearDialogContent();
  };

  /**
   * Handles mouse event to open the menu
   * @param {Object} event - The mouse click event
   */
  const handleMenuOpen = event => {
    setAnchorElement(event.currentTarget);
  };

  /**
   * Closes the menu by clearing the anchor element state
   */
  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  /**
   * Handles the rename menu option click
   */
  const handleRenameClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  /**
   * Handles the delete menu option click
   */
  const handleDeleteClick = () => {
    setDialogContent(
      "Are you sure?",
      <span>
        Cancelling this project will make it inaccessible to Moped users and
        only available to administrators. Users may request a cancelled project
        be restored by{" "}
        <Link
          href={"https://atd.knack.com/dts#new-service-request/"}
          target="new"
        >
          opening a support ticket
        </Link>
        .
      </span>,
      <>
        <Button onClick={handleDelete}>Cancel</Button>
        <Button onClick={handleDialogClose}>Do not cancel</Button>
      </>
    );
    handleDialogOpen();
    handleMenuClose();
  };

  /**
   * Makes actual soft-deletion by running the mutation
   */
  const handleDelete = () => {
    // Change the contents of the dialog
    setDialogContent("Please wait", <CircularProgress />, null);

    // run the mutation
    archiveProject()
      .then(() => {
        // Do not close the dialog, redirect will take care
        window.location = "/moped/projects";
      })
      .catch(err => {
        // If there is an error, show it in the dialog
        setDialogContent(
          "Error",
          "It appears there was an error while deleting, please contact the Data & Technology Services department. Reference: " +
            String(err),
          <Button onClick={handleDialogClose}>Close</Button>
        );
      });
  };

  /**
   * Routine to pass down to ProjectNameEditable so it can indicate when a name
   * update has been issued allowing this component to refetch() and populate
   * data.
   */
  const handleNameUpdate = () => {
    refetch();
  };

  return (
    <ApolloErrorHandler error={error}>
      <Page
        title={
          loading ? "Project Summary Page" : data.moped_project[0].project_name
        }
      >
        <Container maxWidth="xl">
          <Card className={classes.cardWrapper}>
            {loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.root}>
                <Box p={4} pb={2}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box pb={1}>
                        <Breadcrumbs aria-label="all-projects-breadcrumb">
                          <Link component={RouterLink} to={allProjectsLink}>
                            <strong>{"< ALL PROJECTS"}</strong>
                          </Link>
                        </Breadcrumbs>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={11} className={classes.title}>
                      <ProjectNameEditable
                        projectName={data.moped_project[0].project_name}
                        projectId={projectId}
                        editable={true}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        updatedCallback={handleNameUpdate}
                      />
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <MoreHorizIcon
                        aria-controls="fade-menu"
                        aria-haspopup="true"
                        className={classes.moreHorizontal}
                        onClick={handleMenuOpen}
                      />
                      <Menu
                        id="fade-menu"
                        anchorEl={anchorElement}
                        keepMounted
                        open={menuOpen}
                        onClose={handleMenuClose}
                        TransitionComponent={Fade}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <MenuItem onClick={handleMenuClose} disabled={true}>
                          <ListItemIcon>
                            <Icon fontSize="small">share</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Share" />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose} disabled={true}>
                          <ListItemIcon>
                            <Icon fontSize="small">favorite</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Add to favorites" />
                        </MenuItem>

                        <KnackSync
                          project={data.moped_project[0]}
                          closeHandler={handleMenuClose}
                          snackbarHandler={handleSnackbarOpen}
                          refetch={refetch}
                        />

                        <MenuItem onClick={handleRenameClick}>
                          <ListItemIcon>
                            <Icon fontSize="small">create</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Rename" />
                        </MenuItem>
                        <MenuItem
                          onClick={handleMenuClose}
                          selected={false}
                          disabled={true}
                        >
                          <ListItemIcon>
                            <Icon fontSize="small">block</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Place on hold" />
                        </MenuItem>
                        <MenuItem
                          onClick={handleDeleteClick}
                          className={classes.menuDangerItem}
                          selected={false}
                        >
                          <ListItemIcon className={classes.menuDangerText}>
                            <Icon fontSize="small">delete</Icon>
                          </ListItemIcon>
                          <ListItemText
                            primary="Cancel"
                            className={classes.menuDangerText}
                          />
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
                <AppBar className={classes.appBar} position="static">
                  <Tabs
                    classes={{ indicator: classes.indicatorColor }}
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="Project Details Tabs"
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
                {TABS.map((tab, i) => {
                  const TabComponent = tab.Component;
                  return (
                    <TabPanel
                      data-name={"moped-project-view-tabpanel"}
                      key={tab.label}
                      value={activeTab}
                      index={i}
                      className={tab.label === "Map" ? classes.noPadding : null}
                    >
                      <TabComponent
                        loading={loading}
                        data={data}
                        error={error}
                        refetch={refetch}
                      />
                    </TabPanel>
                  );
                })}
              </div>
            )}
          </Card>
        </Container>
        {dialogOpen && dialogState && (
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <h2>{dialogState?.title}</h2>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {dialogState?.body}
              </DialogContentText>
            </DialogContent>
            <DialogActions>{dialogState?.actions}</DialogActions>
          </Dialog>
        )}
      </Page>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarState.open}
        onClose={handleSnackbarClose}
        key={"datatable-snackbar"}
        autoHideDuration={5000}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </ApolloErrorHandler>
  );
};

export default ProjectView;
