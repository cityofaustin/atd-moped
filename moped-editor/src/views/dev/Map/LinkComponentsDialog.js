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

const LinkComponentsDialog = ({
  showDialog,
  setShowDialog,
  components,
  setSelectedFeatures,
  selectedFeatures,
  componentFeatures,
  setComponentFeatures,
  setIsLinkingComponents,
  setLinkMode,
}) => {
  const classes = useStyles();
  const [componentIdsToLink, setComponentIdsToLink] = useState([]);

  const onSave = () => {
    /**
     * let's assume componentFeatures is an object that looks like this
     * {
     *  features:
     *    [
     *      id: <someVal>,
     *      components: <array of component ids>
     *     ]
     *   }
     * }
     */

    // make a new copy, then we can rely on object references to keep things tidy
    const newComponentFeatures = cloneDeep(componentFeatures);
    // add the selected components to the features
    const existingFeaturesWithLinks = newComponentFeatures.features;
    selectedFeatures.forEach((thisFeature) => {
      // is this feature already known to componentFeatures?
      const isExistingFeature = existingFeaturesWithLinks.find(
        (existingFeature) => existingFeature.id === thisFeature.properties.id
      );
      if (isExistingFeature) {
        // add all of the current component IDs to it
        isExistingFeature.components.push(componentIdsToLink);
        // and lazily de-dupe it
        isExistingFeature.components = [
          ...new Set(isExistingFeature.components),
        ];
      } else {
        // this feature previously had 0 components - add them
        existingFeaturesWithLinks.push({
          id: thisFeature.properties.id,
          components: [...componentIdsToLink],
        });
      }
    });
    // commit state
    setComponentFeatures(newComponentFeatures);
    // reset other states
    setSelectedFeatures([]);
    setComponentIdsToLink([]);
    setShowDialog(false);
    setIsLinkingComponents(false);
    setLinkMode(null);
  };

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
                onClick={() => {
                  const thisComponentId = component._id;
                  if (!componentIdsToLink.includes(thisComponentId)) {
                    // add component
                    const newComponentIdsToLink = [
                      ...componentIdsToLink,
                      thisComponentId,
                    ];
                    setComponentIdsToLink(newComponentIdsToLink);
                  } else {
                    const newComponentIdsToLink = componentIdsToLink.filter(
                      (linkedComponentId) =>
                        linkedComponentId !== thisComponentId
                    );

                    setComponentIdsToLink(newComponentIdsToLink);
                  }
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    disableRipple
                    checked={componentIdsToLink.includes(component._id)}
                  />
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
              onClick={onSave}
            >
              Add components
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LinkComponentsDialog;
