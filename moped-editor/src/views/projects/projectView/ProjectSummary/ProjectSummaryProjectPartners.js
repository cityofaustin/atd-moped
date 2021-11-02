import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Grid,
  Icon,
  Input,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";
import { useMutation } from "@apollo/client";
import { PROJECT_UPDATE_PARTNERS } from "../../../../queries/project";

/**
 * ProjectSummaryProjectPartners Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectPartners = ({
  projectId,
  data,
  refetch,
  classes,
}) => {
  const entityList = data?.moped_entity ?? [];
  const originalPartners = data?.moped_proj_partners ?? [];
  const originalSelected = (data?.moped_proj_partners ?? []).map(
    p => p.entity_id
  );
  const nonePartner = [];

  const [editMode, setEditMode] = useState(false);

  const [partner, setPartner] = useState(originalPartners ?? nonePartner);

  // The mutation and mutation function
  const [updateProjectPartners] = useMutation(PROJECT_UPDATE_PARTNERS);

  const [personName, setPersonName] = React.useState([]);

  const handleChange = event => {
    setPersonName(event.target.value);
  };

  /**
   * Resets the sponsor back to its original state, closes edit mode
   */
  const handleProjectSponsorClose = () => {
    setPartner(originalPartners);
    setEditMode(false);
  };

  /**
   * Saves the new project sponsor
   */
  const handleProjectSponsorSave = () => {
    updateProjectPartners({
      variables: {
        projectId: projectId,
        entityId: partner.entity_id,
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
      })
      .catch(err => {
        alert("Unable to make the change: " + String(err));
        handleProjectSponsorClose();
      });
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Project Partners</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Select
              id={`moped-project-summary-partner-select-${projectId}`}
              multiple
              value={personName}
              onChange={handleChange}
              input={<Input />}
              renderValue={selected => selected.join(", ")}
              /*
                      There appears to be a problem with MenuProps in version 4.x (which is fixed in 5.0),
                      this is fixed by overriding the function "getContentAnchorEl".
                          Source: https://github.com/mui-org/material-ui/issues/19245#issuecomment-620488016
                    */
              MenuProps={{
                getContentAnchorEl: () => null,
                style: {
                  maxHeight: 500,
                  width: 450,
                },
              }}
              className={classes.fieldSelectItem}
            >
              {entityList.map(entity => (
                <MenuItem key={entity.entity_name} value={entity.entity_name}>
                  <Checkbox
                    checked={personName.indexOf(entity.entity_name) > -1}
                  />
                  <ListItemText primary={entity.entity_name} />
                </MenuItem>
              ))}
            </Select>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectSponsorSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectSponsorClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={partner?.entity_name || "n/a"}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectPartners;
