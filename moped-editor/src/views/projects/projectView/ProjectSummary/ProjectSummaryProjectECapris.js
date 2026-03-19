import React, { useEffect, useState } from "react";
import { Box, Grid2, Stack, TextField, Typography } from "@mui/material";

import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";
import CopyTextButton from "src/components/CopyTextButton";

import { PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID } from "src/queries/project";
import { fieldBox, fieldGridItem, fieldLabel } from "src/styles/reusableStyles";

/**
 * Custom wrapper for the eCapris edit field
 * @param {JSX.Element} children - Any children
 * @param {boolean} noWrapper - If false, it provides a null wrapper
 * @returns {JSX.Element}
 * @constructor
 */
const WrapperComponent = ({ children, noWrapper }) =>
  noWrapper ? (
    <>
      <Typography sx={fieldLabel}>eCAPRIS Subproject ID</Typography>
      {children}
    </>
  ) : (
    <Grid2 sx={fieldGridItem} size={12}>
      <Typography sx={fieldLabel}>eCAPRIS Subproject ID</Typography>
      {children}
    </Grid2>
  );

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {String} eCaprisSubprojectId - The current eCAPRIS subproject ID
 * @param {Array} options - The list of eCAPRIS subproject funding options
 * @param {boolean} loading - True if it is loading
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectECapris = ({
  projectId,
  eCaprisSubprojectId,
  options,
  loading,
  refetch,
  handleSnackbar,
  noWrapper,
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <WrapperComponent noWrapper={noWrapper}>
      <Box
        sx={[
          {
            display: "flex",
            justifyContent: "flex-start",
          },
          ...(Array.isArray(fieldBox) ? fieldBox : [fieldBox]),
        ]}
      >
        {editMode && (
          <ProjectSummaryAutocomplete
            idColumn={"ecapris_subproject_id"}
            nameColumn={"ecapris_subproject_id"}
            initialValue={{
              id: eCaprisSubprojectId,
              ecapris_subproject_id: eCaprisSubprojectId,
            }}
            optionList={options}
            updateMutation={PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID}
            tooltipText="Current public phase of a project"
            projectId={projectId}
            loading={loading}
            refetch={refetch}
            handleSnackbar={handleSnackbar}
            defaultEditMode={true}
            onClose={() => setEditMode(false)}
          />
        )}
        {!editMode && (
          <Stack
            direction="row"
            spacing={1}
            sx={!eCaprisSubprojectId ? { flex: 1 } : {}} // Grow hoverable input to fill space if missing eCAPRIS id & copy button
          >
            <ProjectSummaryLabel
              text={eCaprisSubprojectId ? eCaprisSubprojectId : ""}
              onClickEdit={() => setEditMode(true)}
            />
            {eCaprisSubprojectId ? (
              <CopyTextButton
                textToCopy={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${eCaprisSubprojectId}`}
                copyButtonText="Copy eCAPRIS link"
                buttonProps={{
                  sx: { minWidth: 160, justifyContent: "flex-start" },
                }}
              />
            ) : null}
          </Stack>
        )}
      </Box>
    </WrapperComponent>
  );
};

export default ProjectSummaryProjectECapris;
