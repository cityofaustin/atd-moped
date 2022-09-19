import React, { useState, useReducer, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
  Checkbox,
  ListItemIcon,
  Grid,
  Button,
} from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
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

const AssociateComponentsDialogue = ({
  showDialog,
  setShowDialog,
  components,
  setSelectedFeatures
}) => {
  const classes = useStyles();

  return (
    <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Add components to features...</h3>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            setShowDialog(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {components.map((component, i) => (
            <React.Fragment key={i}>
              <ListItem
                button
                // onClick={() => setSelectedComponentId(component._id)}
                // selected={component._id === selectedComponentId}
              >
                <ListItemIcon>
                  <Checkbox edge="start" disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={component.component_name}
                  secondary={component.component_subtype}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Grid container spacing={2} display="flex" justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleOutline />}
              onClick={() => {
                setSelectedFeatures([]);
                setShowDialog(false);
              }}
            >
              Add components
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AssociateComponentsDialogue;
