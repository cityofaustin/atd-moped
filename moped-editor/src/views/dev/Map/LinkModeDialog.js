import React, { useState, useReducer, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Button,
} from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { cloneDeep } from "lodash";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const LinkModeDialog = ({
  showDialog,
  setShowDialog,
  setLinkMode,
  setCurrTab,
  setIsLinkingComponents,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={showDialog}
      onClose={() => {
        setShowDialog(false);
        setIsLinkingComponents(false);
      }}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Which type of features?</h3>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            setIsLinkingComponents(false);
            setShowDialog(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} display="flex" justifyContent="center">
          <Grid item>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              className={classes.margin}
              startIcon={<RoomIcon />}
              onClick={() => {
                setLinkMode("points");
                // switch to features tab
                setCurrTab(0);
                setShowDialog(false);
              }}
            >
              Intersections
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.margin}
              startIcon={<TimelineIcon />}
              onClick={() => {
                setLinkMode("lines");
                // switch to features tab
                setCurrTab(0);
                setShowDialog(false);
              }}
            >
              Segments
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LinkModeDialog;
