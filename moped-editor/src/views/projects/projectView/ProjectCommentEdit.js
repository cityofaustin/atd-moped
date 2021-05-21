import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Fade,
  Icon,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
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

const ProjectCommentEdit = () => {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);
  const menuOpen = anchorElement ?? false;

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
   * Makes actual soft-deletion by running the mutation
   */
  const handleDelete = () => {
    // Change the contents of the dialog
    setDialogContent("Please wait", <CircularProgress />, null);
  };

  /**
   * Clears the dialog contents
   */
  const clearDialogContent = () => {
    setDialogState(null);
  };

  return (
    <>
      <MoreHorizIcon
        aria-controls="fade-menu"
        aria-haspopup="true"
        className={classes.moreHorizontal}
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
          <ListItemText primary="Delete" className={classes.menuDangerText} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProjectCommentEdit;
