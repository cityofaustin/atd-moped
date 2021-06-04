import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { COMPONENT_DETAILS_QUERY } from "../../../queries/project";

const useStyles = makeStyles(theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formSelect: {
    width: "60%",
  },
  formButton: {
    margin: theme.spacing(1),
  },
}));

const ProjectComponentEdit = ({ componentId, cancelEdit }) => {
  const classes = useStyles();

  const [selectedComponentId, setSelectedComponentId] = useState(0);

  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponentSubType, setSelectedComponentSubtype] = useState(
    null
  );
  const [availableSubtypes, setAvailableSubtypes] = useState([]);

  const { loading, data, error, refetch } = useQuery(COMPONENT_DETAILS_QUERY, {
    variables: {
      componentId: componentId,
    },
  });

  /**
   * On select, it changes the available items for that specific type
   * @param {Object} e - The Object Type
   */
  const handleComponentTypeSelect = e => {
    const selectedType = e.target.value;

    // Set The selected component type
    setSelectedComponentType(selectedType);
  };

  useEffect(() => {
    console.log("Component Type Changed", selectedComponentType);
  }, [selectedComponentType]);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div>Editing Component ID: {componentId}</div>
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <InputLabel id="mopedComponentType">Type</InputLabel>
          <Select
            className={classes.formSelect}
            labelId="mopedComponentType"
            id="mopedComponentTypeSelect"
            value={selectedComponentType}
            onChange={handleComponentTypeSelect}
          >
            {[
              ...new Set(
                data.moped_components.map(
                  moped_component => moped_component.component_name
                )
              ),
            ]
              .sort()
              .map(moped_component => {
                return (
                  <MenuItem
                    key={`moped-component-menuitem-${moped_component}`}
                    value={moped_component}
                  >
                    {moped_component}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <Button
          className={classes.formButton}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
        <Button
          className={classes.formButton}
          onClick={cancelEdit}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProjectComponentEdit;
