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
import ListIcon from "@material-ui/icons/List";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const EditModeDialog = ({ showDialog, onClose, setIsEditingComponent }) => {
  const classes = useStyles();

  return (
    <Dialog open={showDialog} onClose={onClose}>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>What do you want to edit?</h3>
        <IconButton onClick={onClose}>
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
              startIcon={<ListIcon />}
              onClick={() => {}}
            >
              Attributes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.margin}
              startIcon={<TimelineIcon />}
              onClick={() => {}}
            >
              Map
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditModeDialog;
