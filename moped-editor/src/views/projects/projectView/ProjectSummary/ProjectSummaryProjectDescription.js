import React, { useState } from "react";
import { Box, Grid, Icon, Typography, IconButton } from "@mui/material";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";

import { PROJECT_UPDATE_DESCRIPTION } from "src/queries/project";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import * as yup from "yup";
import { agolFieldCharMax } from "src/constants/projects";

const validationSchema = yup.object().shape({
  description: yup
    .string()
    .max(
      agolFieldCharMax.descriptionString,
      `Description must be ${agolFieldCharMax.descriptionString} characters or less`
    )
    .nullable()
    .required("Required"),
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
  refetch,
  classes,
  handleSnackbar,
  listViewQuery,
}) => {
  const originalDescription =
    data?.moped_project?.[0]?.project_description ?? null;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { description: originalDescription },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [editMode, setEditMode] = useState(false);

  const [updateProjectDescription, { loading }] = useMutation(
    PROJECT_UPDATE_DESCRIPTION
  );

  /**
   * Switch to view mode on close
   */
  const handleProjectDescriptionClose = () => {
    setEditMode(false);
  };

  /**
   * Switch to view mode and revert to original value on cancel
   */
  const handleCancel = () => {
    setValue("description", originalDescription);
    handleProjectDescriptionClose();
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
      refetchQueries: [{ query: listViewQuery }],
    })
      .then(() => {
        refetch().then(() => {
          handleProjectDescriptionClose();
          handleSnackbar(true, "Project description updated", "success");
        });
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
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Description</Typography>

      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
        flexWrap="nowrap"
        alignItems="center"
        component="form"
        onSubmit={handleSubmit(handleProjectDescriptionSave)}
      >
        {editMode ? (
          <>
            <ControlledTextInput
              variant="standard"
              fullWidth
              autoFocus
              multiline
              minRows={4}
              maxRows={10}
              id="description"
              name="description"
              size="small"
              control={control}
              error={errors?.description || loading}
              helperText={errors?.description?.message}
            />
            <IconButton
              size="large"
              disabled={errors?.description}
              type="submit"
            >
              <Icon>check</Icon>
            </IconButton>
            <IconButton disabled={loading} onClick={handleCancel} size="large">
              <Icon>close</Icon>
            </IconButton>
          </>
        ) : (
          <ProjectSummaryLabel
            text={
              originalDescription.trim().length > 0
                ? originalDescription
                : " - "
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectDescription;
