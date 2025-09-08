import React, { useState } from "react";
import { Box, Grid, Icon, Typography, IconButton } from "@mui/material";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";

import { PROJECT_UPDATE_DESCRIPTION } from "src/queries/project";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import * as yup from "yup";
import { agolValidation } from "src/constants/projects";
import { fieldBox, fieldGridItem, fieldLabel } from "src/styles/reusableStyles";

const validationSchema = yup.object().shape({
  description: agolValidation.description,
});

/**
 * ProjectSummaryProjectDescription Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectDescription = ({
  projectId,
  data,
  refetch,
  handleSnackbar,
  listViewQuery,
}) => {
  const originalDescription =
    data?.moped_project?.[0]?.project_description ?? null;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
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
        description: 1,
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
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>Description</Typography>

      <Box
        display="flex"
        justifyContent="flex-start"
        sx={fieldBox}
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
              error={!!errors?.description}
              helperText={errors?.description?.message}
              InputProps={{
                disabled: loading,
              }}
            />
            <IconButton
              size="large"
              disabled={!isDirty || loading}
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
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectDescription;
