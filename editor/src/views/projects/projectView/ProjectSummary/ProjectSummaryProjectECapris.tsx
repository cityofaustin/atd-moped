import { useState } from "react";
import ProjectSummaryIconButtons from "src/views/projects/projectView/ProjectSummary/ProjectSummaryIconButtons";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";
import CopyTextButton from "src/components/CopyTextButton";
import ExternalLink from "src/components/ExternalLink";
import { createBugReportLink } from "src/utils/urls";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useMutation, type ApolloQueryResult } from "@apollo/client";
import { useUser } from "src/auth/user";
import { filterOptions } from "src/utils/autocompleteHelpers";
import { type HandleSnackbar } from "src/components/useFeedbackSnackbar";
import {
  type ProjectSummaryQuery,
  type GetFundingLookupsQuery,
} from "src/gql/graphql";

import {
  fieldBox,
  fieldGridItem,
  fieldLabel,
  fieldLabelText,
  fieldLabelTextNoHover,
  fieldSelectItem,
} from "src/styles/reusableStyles";
import {
  PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID,
  PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID,
} from "src/queries/project";

type SubprojectFundingOptionArray = GetFundingLookupsQuery["ecapris_options"];
type SubprojectFundingOption = SubprojectFundingOptionArray[number]

interface ProjectSummaryECaprisProps {
  /** The id of the current project being viewed */
  projectId: number;
  /** The current eCAPRIS subproject ID */
  eCaprisSubprojectId: string | null;
  /**  The list of eCAPRIS subproject ID options */
  options: SubprojectFundingOptionArray;
  /** True if project summary refetch is loading */
  loading: boolean;
  /** refetch function from Apollo */
  // refetch: () => Promise<ApolloQueryResult<ProjectSummaryQuery>>;
  refetch: () => void | (() => Promise<ApolloQueryResult<ProjectSummaryQuery>>);
  /** The function to show the snackbar */
  handleSnackbar: HandleSnackbar;
  /** Whether the edit functionality should be disabled, defaults to false */
  disabled?: boolean;
}

// todo: refetch in projectsummary is different than refetch in funding table

// Find full option object by id
const findOptionById = (options: SubprojectFundingOptionArray, id: string) => {
  return options.find((option) => option?.ecapris_subproject_id === id);
};

// Get option label for autocomplete display
const getOptionLabel = (option: SubprojectFundingOption) => {
  return option
    ? `${option.ecapris_subproject_id} - ${option.subproject_name}`
    : "";
};

const ProjectSummaryProjectECapris = ({
  projectId,
  eCaprisSubprojectId,
  options,
  loading,
  refetch,
  handleSnackbar,
  disabled = false,
}: ProjectSummaryECaprisProps) => {
{/* @ts-expect-error TODO the user provider? */}
  const { user } = useUser();
  const userEmail = user?.idToken?.payload?.email;

  const initialValue = eCaprisSubprojectId
    ? (findOptionById(options, eCaprisSubprojectId) ?? {
        ecapris_subproject_id: eCaprisSubprojectId,
      })
    : null;

  const [editMode, setEditMode] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SubprojectFundingOption|null>(null);
  // Capture input value to include in service request if user encounters missing eCAPRIS subproject ID in options list
  const [inputValue, setInputValue] = useState("");

  const isClearingValue = selectedValue === null;
  const [updateECaprisId, { loading: updateLoading }] = useMutation(
    PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID
  );
  const [clearECaprisId, { loading: clearLoading }] = useMutation(
    PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID
  );

  const handleFieldClose = () => {
    setSelectedValue(null);
    setInputValue("");
    setEditMode(false);
  };

  const handleFieldSave = () => {
    const mutation = isClearingValue ? clearECaprisId : updateECaprisId;

    mutation({
      variables: {
        projectId: projectId,
        ...(isClearingValue
          ? {}
          : {
              eCaprisSubprojectId: selectedValue?.ecapris_subproject_id ?? null,
            }),
      },
    })
      .then(() => refetch())
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, "eCAPRIS subproject ID updated", "success");
      })
      .catch((error) => {
        setEditMode(false);
        setSelectedValue(null);
        handleSnackbar(
          true,
          "Error updating eCAPRIS subproject ID",
          "error",
          error
        );
      });
  };

  return (
    <Grid size={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>eCAPRIS subproject ID</Typography>
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
          <>
            <Autocomplete
              value={selectedValue}
              sx={fieldSelectItem}
              options={options}
              getOptionLabel={(e) =>
                e?.["ecapris_subproject_id"] ? getOptionLabel(e) : ""
              }
              isOptionEqualToValue={(option, value) =>
                option?.["ecapris_subproject_id"] ===
                value?.["ecapris_subproject_id"]
              }
              // Use custom filterOptions function to limit number of options rendered for performance
              filterOptions={filterOptions}
              onChange={(_, newValue) => {
                setSelectedValue(newValue);
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={null}
                  autoFocus
                />
              )}
              openOnFocus={true}
              noOptionsText={
                <Typography variant="body2">
                  eCAPRIS subproject ID not found.{" "}
                  {
                    /* @ts-expect-error to do still */
                    <ExternalLink
                      url={createBugReportLink(
                        {
                          message: `Missing eCAPRIS subproject ID ${inputValue ?? ""} for project ${projectId}`,
                        },
                        userEmail
                      )}
                      text={"Click here"}
                    />
                  }{" "}
                  to report.
                </Typography>
              }
              disabled={disabled}
            />
            <ProjectSummaryIconButtons
              handleSave={handleFieldSave}
              handleClose={handleFieldClose}
              disabledCondition={
                eCaprisSubprojectId ===
                  (selectedValue?.ecapris_subproject_id ?? null) || disabled
              }
              loading={loading || updateLoading || clearLoading}
            />
          </>
        )}
        {!editMode && (
          <Stack
            direction="row"
            spacing={1}
            sx={!eCaprisSubprojectId ? { flex: 1 } : {}} // Grow hoverable input to fill space if missing eCAPRIS id & copy button
          >
            {/* @ts-expect-error to do still */}
            <ProjectSummaryLabel
              text={eCaprisSubprojectId ? eCaprisSubprojectId : ""}
              onClickEdit={() => {
                if (disabled || loading) return;
                setEditMode(true);
                setSelectedValue(initialValue);
              }}
              sxProp={disabled ? fieldLabelTextNoHover : fieldLabelText}
            />
            {eCaprisSubprojectId ? (
              /* @ts-expect-error to do still */
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
    </Grid>
  );
};

export default ProjectSummaryProjectECapris;
