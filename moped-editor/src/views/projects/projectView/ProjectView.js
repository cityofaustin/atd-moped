import React, { useState, useCallback, useContext, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  NavLink as RouterLink,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

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
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Page from "src/components/Page";
import ProjectSummary from "src/views/projects/projectView/ProjectSummary/ProjectSummary";
import MapView from "src/views/projects/projectView/ProjectComponents";
import ProjectFunding from "src/views/projects/projectView/ProjectFunding";
import ProjectTeam from "src/views/projects/projectView/ProjectTeam/ProjectTeam";
import ProjectTimeline from "src/views/projects/projectView/ProjectTimeline";
import ProjectNotes from "src/views/projects/projectView/ProjectNotes";
import ProjectFiles from "src/views/projects/projectView/ProjectFiles";
import TabPanel from "src/views/projects/projectView/TabPanel";
import { PROJECT_ARCHIVE, SUMMARY_QUERY } from "src/queries/project";
import ProjectActivityLog from "src/views/projects/projectView/ProjectActivityLog";
import ProjectNameEditable from "src/views/projects/projectView/ProjectNameEditable";
import ProjectFollowButton from "src/views/projects/projectView/ProjectFollowButton";

import { useSessionDatabaseData } from "src/auth/user";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NotFoundView from "src/views/errors/NotFoundView";
import ProjectListViewQueryContext from "src/components/QueryContextProvider";
import FallbackComponent from "src/components/FallbackComponent";
import FeedbackSnackbar, {
  useFeedbackSnackbar,
} from "src/components/FeedbackSnackbar";
import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TABS = [
  { label: "Summary", Component: ProjectSummary, param: "summary" },
  { label: "Map", Component: MapView, param: "map" },
  { label: "Timeline", Component: ProjectTimeline, param: "timeline" },
  { label: "Team", Component: ProjectTeam, param: "team" },
  { label: "Funding", Component: ProjectFunding, param: "funding" },
  { label: "Notes", Component: ProjectNotes, param: "notes" },
  { label: "Files", Component: ProjectFiles, param: "files" },
  {
    label: "Activity",
    Component: ProjectActivityLog,
    param: "activity_log",
  },
];

/**
 * Get the index of the currently active tab
 * @param {*} tabName - a `tab` name from the url search string
 * @returns {integer} - the TAB index of the currently active tab, falling back to `0`
 */
const useActiveTabIndex = (tabName) =>
  useMemo(() => {
    const activeTabIndex = TABS.findIndex((tab) => tab.param === tabName);
    return activeTabIndex > -1 ? activeTabIndex : 0;
  }, [tabName]);

/**
 * The project summary view
 * @return {JSX.Element}
 * @constructor
 */
const ProjectView = () => {
  const { projectId } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = useActiveTabIndex(searchParams.get("tab"));

  /* Create link back to previous filters using queryString state passed with React Router */
  const locationState = location?.state;
  const previousProjectListViewQueryString = locationState
    ? locationState.queryString
    : null;
  const allProjectsLink = !previousProjectListViewQueryString
    ? "/moped/projects"
    : `/moped/projects${previousProjectListViewQueryString}`;

  /**
   * @constant {boolean} isEditing - When true, it signals a child component we want to edit the project name
   * @constant {boolean} dialogOpen - When true, the dialog shows
   * @constant {dict} dialogState - Contains the 'title', 'body' and 'actions' as either string or JSX
   * @constant {JSX} anchorElement - The element our 'MoreHorizontal' menu anchors to.
   * @constant {object} snackbarState - The current state of the snackbar's configuration
   * @constant {boolean} menuOpen - If true, it shows the menu component. Immutable.
   */
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);

  const menuOpen = Boolean(anchorElement);

  const queryContext = useContext(ProjectListViewQueryContext);

  const userSessionData = useSessionDatabaseData();
  const userId = userSessionData?.user_id;

  const { snackbarState, handleSnackbar, handleSnackbarClose } =
    useFeedbackSnackbar();

  /**
   * The query to gather the project summary data
   */
  const { loading, error, data, refetch } = useQuery(SUMMARY_QUERY, {
    variables: { projectId, userId },
    fetchPolicy: "network-only",
  });

  const isFollowing = data?.moped_user_followed_projects.length > 0;

  /**
   * Handles the click on a tab, which should trigger a change.
   * @param {Object} event - The click event
   * @param {int} newTab - The number of the tab
   */
  const handleChange = useCallback(
    (event, newTab) => {
      // Preserve the queryString state when changing tabs
      setSearchParams(
        {
          tab: TABS[newTab].param,
        },
        {
          state: locationState, // Preserve the location state when changing tabs
        }
      );
      if (newTab === 0) refetch();
    },
    [refetch, setSearchParams, locationState]
  );

  /**
   * The mutation to soft-delete the project
   */
  const [archiveProject] = useMutation(PROJECT_ARCHIVE);

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
  const handleMenuOpen = (event) => {
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
        If you delete this project, it will no longer be visible in Moped or
        accessible in applications that use Moped data.
        <br />
        <br />
        If you need to restore a deleted project, please{" "}
        <Link
          href={
            "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%7D"
          }
          target="new"
        >
          submit a Data &amp; Technology Services support request
        </Link>
        .
      </span>,
      <>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleDelete}>Delete project</Button>
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
    archiveProject({
      variables: { projectId },
    })
      .then(() => {
        // Do not close the dialog, redirect will take care
        window.location = "/moped/projects";
      })
      .catch((err) => {
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
   * Establishes the project status for our badge
   */
  const currentPhase =
    data?.moped_project?.[0]?.moped_proj_phases?.[0]?.moped_phase;
  const isProjectDeleted = data?.moped_project[0]?.is_deleted;

  /**
   * This function exists to enable closing the Map tab
   */
  const onCloseTab = useCallback(() => {
    handleChange(null, 0);
  }, [handleChange]);

  return (
    <>
      {data && !data?.moped_project?.length && <NotFoundView />}
      {data && !!data?.moped_project?.length && (
        <Page
          title={
            loading
              ? "Project Summary Page"
              : `${data.moped_project[0].project_name_full} #${data.moped_project[0].project_id}`
          }
        >
          <Container maxWidth="xl">
            <ErrorBoundary FallbackComponent={FallbackComponent}>
              <Card
                sx={{
                  marginTop: (theme) => theme.spacing(3),
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Box
                    sx={{
                      flexGrow: 1,
                      backgroundColor: (theme) =>
                        theme.palette.background.paper,
                    }}
                  >
                    <Box
                      sx={{
                        pt: 2,
                        px: 3,
                      }}
                    >
                      <Breadcrumbs
                        aria-label="breadcrumb"
                        sx={{ color: "primary.main" }}
                        separator={<NavigateNextIcon fontSize="small" />}
                      >
                        <Link color="inherit" href={allProjectsLink}>
                          {`${
                            previousProjectListViewQueryString
                              ? "Filtered"
                              : "All"
                          } projects`}
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>
                          {`Project #${data.moped_project[0].project_id}`}
                        </Typography>
                      </Breadcrumbs>
                    </Box>
                    <Box px={3} pb={1}>
                      <Grid container>
                        <Grid
                          item
                          xs // Take all available space
                          sx={(theme) => ({
                            minHeight: theme.spacing(8), // Prevent jumping when edit form appears
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0, // Wrap long names
                            [theme.breakpoints.down("lg")]: {
                              my: 1, // Add margin when on small screen and stacked vertically
                            },
                          })}
                        >
                          <Box sx={{ minWidth: 0, width: "100%" }}>
                            <ProjectNameEditable
                              projectData={data.moped_project[0]}
                              projectId={projectId}
                              isEditing={isEditing}
                              setIsEditing={setIsEditing}
                              handleSnackbar={handleSnackbar}
                              refetch={refetch}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          sx={{
                            justifyItems: "right",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexShrink: 0,
                            marginLeft: 2,
                          }}
                        >
                          <Box>
                            <ProjectStatusBadge
                              phaseKey={currentPhase?.phase_key}
                              phaseName={currentPhase?.phase_name}
                            />
                          </Box>
                          <Box>
                            <ProjectFollowButton
                              projectId={projectId}
                              isFollowing={isFollowing}
                              refetch={refetch}
                              handleSnackbar={handleSnackbar}
                            />
                            <IconButton onClick={handleMenuOpen}>
                              <MoreHorizIcon
                                aria-controls="fade-menu"
                                aria-haspopup="true"
                                sx={{
                                  fontSize: "2rem",
                                  float: "right",
                                  cursor: "pointer",
                                }}
                              />
                            </IconButton>
                            <Menu
                              id="fade-menu"
                              anchorEl={anchorElement}
                              keepMounted
                              open={menuOpen}
                              onClose={handleMenuClose}
                              autoFocus={false}
                              TransitionComponent={Fade}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                              }}
                            >
                              <MenuItem
                                onClick={handleRenameClick}
                                sx={{
                                  minWidth: (theme) => theme.spacing(14),
                                }}
                                selected={false}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: (theme) => theme.spacing(2),
                                  }}
                                >
                                  <CreateOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Rename" />
                              </MenuItem>
                              <MenuItem
                                onClick={handleDeleteClick}
                                sx={{
                                  minWidth: (theme) => theme.spacing(14),
                                }}
                                selected={false}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: (theme) => theme.spacing(2),
                                  }}
                                >
                                  <DeleteOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete" />
                              </MenuItem>
                            </Menu>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                    <AppBar
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.background.paper,
                        color: (theme) => theme.palette.text.secondary,
                      }}
                      position="static"
                    >
                      <Tabs
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: (theme) =>
                              theme.palette.primary.light,
                          },
                        }}
                        value={activeTab}
                        onChange={handleChange}
                        variant="scrollable"
                        aria-label="Project Details Tabs"
                      >
                        {TABS.map((tab, i) => {
                          return (
                            <Tab
                              sx={{
                                minWidth: "160px",
                                "&.Mui-selected": {
                                  color: (theme) => theme.palette.text.primary,
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
                    {TABS.map((tab, i) => {
                      const TabComponent = tab.Component;
                      return (
                        <TabPanel
                          data-name={"moped-project-view-tabpanel"}
                          key={tab.label}
                          value={activeTab}
                          index={i}
                          sx={
                            tab.label === "Map"
                              ? {
                                  padding: 0,
                                }
                              : null
                          }
                        >
                          <TabComponent
                            loading={loading}
                            data={data}
                            error={error}
                            refetch={refetch}
                            projectName={
                              data.moped_project[0].project_name_full
                            }
                            phaseKey={currentPhase?.phase_key}
                            phaseName={currentPhase?.phase_name}
                            parentProjectId={
                              data.moped_project[0].parent_project_id
                            }
                            eCaprisSubprojectId={
                              data.moped_project[0].ecapris_subproject_id
                            }
                            onCloseTab={onCloseTab}
                            listViewQuery={queryContext.listViewQuery}
                            handleSnackbar={handleSnackbar}
                          />
                        </TabPanel>
                      );
                    })}
                    {/* </Box> */}
                    {/* </Box> */}
                  </Box>
                )}
              </Card>
            </ErrorBoundary>
          </Container>
          {dialogOpen && dialogState && (
            <Dialog
              open={dialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle variant="h4">{dialogState?.title}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {dialogState?.body}
                </DialogContentText>
              </DialogContent>
              <DialogActions>{dialogState?.actions}</DialogActions>
            </Dialog>
          )}
          {isProjectDeleted && (
            <Dialog
              open={isProjectDeleted}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <Typography variant={"h3"} align={"center"} gutterBottom>
                  This project has been deleted.
                </Typography>
                <Typography align={"center"} style={{ paddingTop: "15px" }}>
                  If you need to restore a deleted project, please{" "}
                  <Link
                    href={
                      "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%7D"
                    }
                    target="new"
                  >
                    submit a Data &amp; Technology Services support request
                  </Link>
                  .
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button>
                  <Link
                    component={RouterLink}
                    to={allProjectsLink}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    Back to all projects
                  </Link>
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Page>
      )}
      <FeedbackSnackbar
        snackbarState={snackbarState}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
};

export default ProjectView;
