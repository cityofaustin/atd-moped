import React, { useState } from "react";
import { Box, Grid, Icon, Typography, IconButton } from "@mui/material";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";

import { PROJECT_UPDATE_DESCRIPTION } from "src/queries/project";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import * as yup from "yup";
import { agolDescriptionCharacterMax } from "src/constants/projects";

const validationSchema = yup.object().shape({
  description: yup
    .string()
    .max(
      agolDescriptionCharacterMax,
      `Description must be at most ${agolDescriptionCharacterMax} characters`
    )
    .required("Description cannot be blank"),
});

/**
 * ProjectSummaryProjectDescription Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectDescription = ({
  projectId,
  data,
  classes,
  handleSnackbar,
  listViewQuery,
}) => {
  const originalDescription =
    data?.moped_project?.[0]?.project_description ?? null;

  const { handleSubmit, errors, control } = useForm({
    defaultValues: { description: originalDescription },
    validationSchema: validationSchema,
  });

  const [editMode, setEditMode] = useState(false);

  const [updateProjectDescription] = useMutation(PROJECT_UPDATE_DESCRIPTION);

  /**
   * Switch to view mode on close
   */
  const handleProjectDescriptionClose = () => {
    setEditMode(false);
  };

  /**
   * Saves the new project description...
   */

  const handleProjectDescriptionSave = ({ description }) => {
    updateProjectDescription({
      variables: {
        projectId: projectId,
        description: description,
      },
      refetchQueries: [{ query: listViewQuery }, "ProjectSummary"],
    })
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, "Project description updated", "success");
      })
      .catch((error) => {
        handleSnackbar(
          true,
          "Error updating project description",
          "error",
          error
        );
        handleProjectDescriptionClose();
      });
    setEditMode(false);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Description</Typography>
      {editMode && (
        <Box
          display="flex"
          justifyContent="flex-start"
          className={classes.fieldBox}
          flexWrap="nowrap"
          alignItems="center"
          component="form"
          onSubmit={handleSubmit(handleProjectDescriptionSave)}
        >
          <ControlledTextInput
            variant="standard"
            fullWidth
            autoFocus
            multiline
            rows={4}
            name="description"
            size="small"
            control={control}
            error={errors?.description}
            helperText={errors?.description?.message}
          />

          <IconButton size="large" disabled={errors?.description} type="submit">
            <Icon>check</Icon>
          </IconButton>

          <IconButton onClick={handleProjectDescriptionClose} size="large">
            <Icon>close</Icon>
          </IconButton>
        </Box>
      )}
      {!editMode && (
        <Box
          display="flex"
          justifyContent="flex-start"
          className={classes.fieldBox}
          flexWrap="nowrap"
          alignItems="center"
        >
          <ProjectSummaryLabel
            text={
              originalDescription.trim().length > 0
                ? originalDescription
                : " - "
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        </Box>
      )}
    </Grid>
  );
};

export default ProjectSummaryProjectDescription;
