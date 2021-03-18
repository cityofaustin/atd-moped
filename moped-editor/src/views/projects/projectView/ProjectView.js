import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Link as RouterLink,
  useParams,
  useLocation,
} from "react-router-dom";
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
} from "@material-ui/core";

import Page from "src/components/Page";
import ProjectSummary from "./ProjectSummary";
import ProjectTeam from "./ProjectTeam";
import ProjectTimeline from "./ProjectTimeline";
import ProjectTabPlaceholder from "./ProjectTabPlaceholder";
import ProjectFiles from "./ProjectFiles";
import TabPanel from "./TabPanel";
import { PROJECT_NAME, PROJECT_ARCHIVE } from "../../../queries/project";
import ProjectActivityLog from "./ProjectActivityLog";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectNameEditable from "./ProjectNameEditable";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

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
  { label: "Files", Component: ProjectFiles, param: "files" },
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

  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);
  const menuOpen = anchorElement ?? false;

  // Get the tab query string value and associated tab index.
  // If there's no query string, default to first tab in TABS array
  let activeTabIndex = !!query.get("tab")
    ? TABS.findIndex(tab => tab.param === query.get("tab"))
    : 0;

  const [activeTab, setActiveTab] = useState(activeTabIndex);

  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
    history.push(`/moped/projects/${projectId}?tab=${TABS[newTab].param}`);
  };

  const { loading, error, data } = useQuery(PROJECT_NAME, {
    variables: { projectId },
  });

  const [archiveProject] = useMutation(PROJECT_ARCHIVE, {
    variables: { projectId },
  });

  const clearDialogContent = () => {
    setDialogState(null);
  };

  const setDialogContent = (title, body, actions) => {
    setDialogState({
      title: title,
      body: body,
      actions: actions,
    });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    clearDialogContent();
  };

  const handleMenuOpen = event => {
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handleRenameClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDialogContent("Please wait", <CircularProgress />, null);

    archiveProject()
      .then(() => {
        window.location = "/moped/projects";
      })
      .catch(err => {
        setDialogContent(
          "Error",
          "It appears there was an error while deleting, please contact the Data & Technology Services department. Reference: " +
            String(err),
          <Button onClick={handleDialogClose}>Close</Button>
        );
      });
  };

  const handleDeleteClick = () => {
    setDialogContent(
      "Are you sure?",
      <span>
        Deleting this project will make it inaccessible to Moped users and only
        available to administrators. Users may request a deleted project be
        restored by{" "}
        <a href={"https://atd.knack.com/dts#new-service-request/"} target="new">
          opening a support ticket
        </a>
        .
      </span>,
      <>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleDialogClose}>Cancel</Button>
      </>
    );
    handleDialogOpen();
    handleMenuClose();
  };

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
                  <Grid container>
                    <Grid item xs={11} md={11} className={classes.title}>
                      <ProjectNameEditable
                        projectName={data.moped_project[0].project_name}
                        projectId={projectId}
                        editable={true}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
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
                          onClick={handleMenuClose}
                          selected={false}
                          disabled={true}
                        >
                          <ListItemIcon>
                            <Icon fontSize="small">share</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Share" />
                        </MenuItem>
                        <MenuItem
                          onClick={handleMenuClose}
                          selected={false}
                          disabled={true}
                        >
                          <ListItemIcon>
                            <Icon fontSize="small">favorite</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Add to favorites" />
                        </MenuItem>
                        <MenuItem onClick={handleRenameClick} selected={false}>
                          <ListItemIcon>
                            <Icon fontSize="small">create</Icon>
                          </ListItemIcon>
                          <ListItemText primary="Rename" />
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
                            primary="Delete"
                            className={classes.menuDangerText}
                          />
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
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
    </ApolloErrorHandler>
  );
};

export default ProjectView;
