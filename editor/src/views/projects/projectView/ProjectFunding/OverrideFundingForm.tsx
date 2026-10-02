import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { type ApolloQueryResult, useMutation } from "@apollo/client";
import { type ControllerRenderProps, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import {
  currencyFormatter,
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";
import { filterOptions } from "src/utils/autocompleteHelpers";
import {
  ADD_PROJECT_FUNDING_AND_REATTACH,
  UPDATE_PROJECT_FUNDING,
} from "src/queries/funding";
import {
  nullIfSameAsEcapris,
  type FundingRowFromQuery,
  type SavedFundingRow,
} from "src/views/projects/projectView/ProjectFunding/helpers";
import {
  type GetCombinedProjectFundingQuery,
  type GetFundingLookupsQuery,
  type UpdateProjectFundingMutationVariables,
} from "src/gql/graphql";
import { type HandleSnackbar } from "src/components/useFeedbackSnackbar";
// @ts-expect-error yup 0.29 does not ship type declarations; upgrade captured in #XXXXX
import * as yup from "yup";

type FundSource = GetFundingLookupsQuery["moped_fund_sources"][number];
type FundProgram = GetFundingLookupsQuery["moped_fund_programs"][number];
type FundStatus = GetFundingLookupsQuery["moped_fund_status"][number];

/** Values stored in moped_proj_funding are overrides; null means the eCAPRIS value is inherited */
type OverrideFundingFormValues = {
  funding_amount: FundingRowFromQuery["moped_funding_amount"];
  description: string;
  funding_source_id: FundingRowFromQuery["moped_funding_source_id"];
  funding_program_id: FundingRowFromQuery["moped_funding_program_id"];
  fund_status: number | null;
};

/** Form fields that override an eCAPRIS value and can be reverted to inherit it */
type OverridableFieldName =
  "funding_amount" | "funding_source_id" | "funding_program_id";

const validationSchema = ({
  appropriatedFunding,
}: {
  appropriatedFunding: number | null;
}) => {
  // Messages only show when appropriatedFunding is not null
  const appropriatedFundingLabel = currencyFormatter.format(
    appropriatedFunding ?? 0
  );

  return yup.object().shape({
    funding_amount: yup
      .number()
      .nullable()
      .test(
        "lessThanAppropriated",
        `Amount cannot exceed appropriated amount of ${appropriatedFundingLabel}`,
        function (value: number | null) {
          if (value === null || appropriatedFunding === null) return true;
          return value <= appropriatedFunding;
        }
      )
      .test(
        "differentFromAppropriated",
        `Amount must be different from appropriated amount of ${appropriatedFundingLabel} if overriding`,
        function (value: number | null) {
          if (value === null || appropriatedFunding === null) return true;
          return value !== appropriatedFunding;
        }
      ),
  });
};

/**
 * Keeps only digits so a formatted amount like $86,753.09 is stored as 86753
 * @param {string} value - the current input value
 * @param {Object} field - the react-hook-form field object
 */
const amountOnChangeHandler = (
  value: string,
  field: ControllerRenderProps<OverrideFundingFormValues, "funding_amount">
) => {
  const integerValue = value
    ? removeNonIntegers(removeDecimalsAndTrailingNumbers(value))
    : "";
  field.onChange(integerValue === "" ? null : Number(integerValue));
};

const amountValueHandler = (
  value: OverrideFundingFormValues["funding_amount"] | undefined
) =>
  value === null || value === undefined ? "" : currencyFormatter.format(value);

interface EcaprisOverridableFieldProps {
  /** Label shown when the input is focused or has an override value */
  fieldLabel: string;
  /** eCAPRIS value shown as the label when inherited */
  ecaprisValueLabel: string | null;
  /** Reference text shown below the input */
  ecaprisHelperText: string;
  /** If the input has a value that overrides the eCAPRIS value */
  hasOverride: boolean;
  /** Clears the override value so the eCAPRIS value is inherited */
  onRevert: () => void;
  /** Optional validation error message */
  errorMessage?: string;
  /** Renders the input given the label to display */
  renderInput: (label: string) => ReactNode;
}

/**
 * Wraps an input whose value overrides an eCAPRIS value. When the input is empty and unfocused,
 * the eCAPRIS value shows in place of the label so it reads as the inherited value.
 */
const EcaprisOverridableField = ({
  fieldLabel,
  ecaprisValueLabel,
  ecaprisHelperText,
  hasOverride,
  onRevert,
  errorMessage,
  renderInput,
}: EcaprisOverridableFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const label =
    isFocused || hasOverride || !ecaprisValueLabel
      ? fieldLabel
      : ecaprisValueLabel;

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
      <FormControl
        fullWidth
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {renderInput(label)}
        <FormHelperText sx={{ color: "primary.main" }}>
          {ecaprisHelperText}
        </FormHelperText>
        {errorMessage ? (
          <FormHelperText error>{errorMessage}</FormHelperText>
        ) : null}
      </FormControl>
      <Button onClick={onRevert} disabled={!hasOverride} sx={{ mt: 0.25 }}>
        Revert
      </Button>
    </Stack>
  );
};

export interface OverrideFundingFormProps {
  /** The eCAPRIS synced or overridden funding row being edited */
  fundingRecord: SavedFundingRow;
  /** The project ID the funding record belongs to */
  projectId: number;
  /** Refetches the funding table query after saving */
  refetchFundingQuery: () => Promise<
    ApolloQueryResult<GetCombinedProjectFundingQuery>
  >;
  /** Sets the funding record being overridden; null closes the dialog */
  setOverrideFundingRecord: Dispatch<SetStateAction<SavedFundingRow | null>>;
  /** Function to handle snackbar notifications for user feedback */
  handleSnackbar: HandleSnackbar;
  /** Closes the override dialog */
  handleClose: () => void;
  /** Funding lookup table options */
  dataLookups: GetFundingLookupsQuery;
}

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  handleClose,
  dataLookups,
}: OverrideFundingFormProps) => {
  const appropriatedFunding = fundingRecord.ecapris_funding?.app ?? null;
  const ecaprisSourceId =
    fundingRecord.ecapris_funding?.funding_source_id ?? null;
  const ecaprisProgramId =
    fundingRecord.ecapris_funding?.funding_program_id ?? null;

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, errors },
    setValue,
  } = useForm<OverrideFundingFormValues>({
    defaultValues: {
      funding_amount: fundingRecord.moped_funding_amount ?? null,
      description: fundingRecord.funding_description ?? "",
      funding_source_id: fundingRecord.moped_funding_source_id ?? null,
      funding_program_id: fundingRecord.moped_funding_program_id ?? null,
      fund_status: fundingRecord.moped_fund_status?.funding_status_id ?? null,
    },
    resolver: yupResolver(validationSchema({ appropriatedFunding })),
    mode: "onChange",
  });

  const [fundingAmount, fundingSourceId, fundingProgramId] = useWatch({
    control,
    name: ["funding_amount", "funding_source_id", "funding_program_id"],
  });

  const revertField = (name: OverridableFieldName) =>
    setValue(name, null, { shouldDirty: true, shouldValidate: true });

  // if record is synced from ecapris and not yet manual, its first time overriding amount and description
  const isNewOverride = Boolean(
    fundingRecord.is_synced_from_ecapris && !fundingRecord.is_manual
  );
  const fundingSources = dataLookups.moped_fund_sources;
  const fundingPrograms = dataLookups.moped_fund_programs;
  const fundingStatuses = dataLookups.moped_fund_status;

  const ecaprisSourceName =
    fundingSources.find(
      (source) => source.funding_source_id === ecaprisSourceId
    )?.funding_source_name ?? null;
  const ecaprisProgramName =
    fundingPrograms.find(
      (program) => program.funding_program_id === ecaprisProgramId
    )?.funding_program_name ?? null;
  const ecaprisAmountLabel =
    appropriatedFunding === null
      ? null
      : currencyFormatter.format(appropriatedFunding);

  const [addProjectFundingAndReattach, { loading: addLoading }] = useMutation(
    ADD_PROJECT_FUNDING_AND_REATTACH
  );
  const [updateProjectFunding, { loading: updateLoading }] = useMutation(
    UPDATE_PROJECT_FUNDING
  );
  const isMutationLoading = isNewOverride ? addLoading : updateLoading;

  const onSubmit = async (data: OverrideFundingFormValues) => {
    const { proj_funding_id } = fundingRecord;
    if (proj_funding_id === null) return;

    const fundingValues: Omit<
      UpdateProjectFundingMutationVariables,
      "proj_funding_id"
    > = {
      fdu: fundingRecord.fdu?.fdu ?? null,
      unit_long_name: fundingRecord.fdu?.unit_long_name ?? null,
      funding_amount: data.funding_amount,
      funding_description: data.description,
      // Store null for values matching eCAPRIS so they are inherited instead of overridden
      funding_source_id: nullIfSameAsEcapris(
        data.funding_source_id,
        ecaprisSourceId
      ),
      funding_program_id: nullIfSameAsEcapris(
        data.funding_program_id,
        ecaprisProgramId
      ),
      funding_status_id: data.fund_status ?? 1,
    };

    const snackbarVerb = isNewOverride ? "add" : "updat";

    try {
      if (isNewOverride) {
        const fileAttachmentObjects = fundingRecord.ecapris_funding_files.map(
          (file) => ({ file_id: file.moped_project_file.project_file_id })
        );

        await addProjectFundingAndReattach({
          variables: {
            fundingObjects: {
              ...fundingValues,
              ecapris_funding_id: fundingRecord.fdu?.ecapris_funding_id ?? null,
              ecapris_subproject_id: fundingRecord.ecapris_subproject_id,
              project_id: projectId,
              files_project_fundings: { data: fileAttachmentObjects },
            },
            entityId: proj_funding_id,
            projectId,
          },
        });
      } else {
        await updateProjectFunding({
          variables: {
            ...fundingValues,
            proj_funding_id,
          },
        });
      }

      handleSnackbar(true, `Funding source ${snackbarVerb}ed`, "success");
      refetchFundingQuery();
      setOverrideFundingRecord(null);
      handleClose();
    } catch (error) {
      handleSnackbar(
        true,
        `Error ${snackbarVerb}ing funding source`,
        "error",
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid size={12}>
          <EcaprisOverridableField
            fieldLabel="Funding source"
            ecaprisValueLabel={ecaprisSourceName}
            ecaprisHelperText={
              ecaprisSourceName
                ? `eCAPRIS source: ${ecaprisSourceName}`
                : "No funding source in eCAPRIS"
            }
            hasOverride={fundingSourceId !== null}
            onRevert={() => revertField("funding_source_id")}
            renderInput={(label) => (
              // @ts-expect-error Migrating ControlledAutocomplete to TS captured in #XXXXX
              <ControlledAutocomplete
                control={control}
                name="funding_source_id"
                label={label}
                options={fundingSources}
                filterOptions={filterOptions}
                getOptionLabel={(option: FundSource | null) =>
                  option?.funding_source_name || ""
                }
                onChangeHandler={(
                  fundSource: FundSource | null,
                  field: ControllerRenderProps<
                    OverrideFundingFormValues,
                    "funding_source_id"
                  >
                ) => field.onChange(fundSource?.funding_source_id || null)}
                isOptionEqualToValue={(
                  option: FundSource,
                  selectedOption: FundSource
                ) =>
                  option.funding_source_id === selectedOption.funding_source_id
                }
                valueHandler={(value: number | null) =>
                  value
                    ? fundingSources.find(
                        (source) => source.funding_source_id === value
                      )
                    : null
                }
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <EcaprisOverridableField
            fieldLabel="Funding program"
            ecaprisValueLabel={ecaprisProgramName}
            ecaprisHelperText={
              ecaprisProgramName
                ? `eCAPRIS program: ${ecaprisProgramName}`
                : "No funding program in eCAPRIS"
            }
            hasOverride={fundingProgramId !== null}
            onRevert={() => revertField("funding_program_id")}
            renderInput={(label) => (
              // @ts-expect-error Migrating ControlledAutocomplete to TS captured in #XXXXX
              <ControlledAutocomplete
                control={control}
                name="funding_program_id"
                label={label}
                options={fundingPrograms}
                filterOptions={filterOptions}
                getOptionLabel={(option: FundProgram | null) =>
                  option?.funding_program_name || ""
                }
                onChangeHandler={(
                  fundProgram: FundProgram | null,
                  field: ControllerRenderProps<
                    OverrideFundingFormValues,
                    "funding_program_id"
                  >
                ) => field.onChange(fundProgram?.funding_program_id || null)}
                isOptionEqualToValue={(
                  option: FundProgram,
                  selectedOption: FundProgram
                ) =>
                  option.funding_program_id ===
                  selectedOption.funding_program_id
                }
                valueHandler={(value: number | null) =>
                  value
                    ? fundingPrograms.find(
                        (program) => program.funding_program_id === value
                      )
                    : null
                }
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              // @ts-expect-error Migrating ControlledTextInput to TS captured in #XXXXX
              fullWidth
              label="Description"
              multiline
              rows={2}
              name="description"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            {/* @ts-expect-error Migrating ControlledAutocomplete to TS captured in #XXXXX */}
            <ControlledAutocomplete
              control={control}
              name="fund_status"
              label="Status"
              options={fundingStatuses}
              filterOptions={filterOptions}
              getOptionLabel={(option: FundStatus | null) =>
                option?.funding_status_name || ""
              }
              onChangeHandler={(
                fundStatus: FundStatus | null,
                field: ControllerRenderProps<
                  OverrideFundingFormValues,
                  "fund_status"
                >
              ) => field.onChange(fundStatus?.funding_status_id || 1)}
              isOptionEqualToValue={(
                option: FundStatus,
                selectedOption: FundStatus
              ) =>
                option.funding_status_id === selectedOption.funding_status_id
              }
              valueHandler={(value: number | null) =>
                value
                  ? fundingStatuses.find(
                      (status) => status.funding_status_id === value
                    )
                  : null
              }
            />
          </FormControl>
        </Grid>
        <Grid size={12}>
          <EcaprisOverridableField
            fieldLabel="Funding amount"
            ecaprisValueLabel={ecaprisAmountLabel}
            ecaprisHelperText={`eCAPRIS amount: ${ecaprisAmountLabel ?? "-"}`}
            hasOverride={fundingAmount !== null}
            onRevert={() => revertField("funding_amount")}
            errorMessage={errors.funding_amount?.message}
            renderInput={(label) => (
              <ControlledTextInput
                // @ts-expect-error Migrating ControlledTextInput to TS captured in #XXXXX
                fullWidth
                label={label}
                name="funding_amount"
                control={control}
                size="small"
                type="text"
                inputMode="numeric"
                valueHandler={amountValueHandler}
                onChangeHandler={amountOnChangeHandler}
                error={!!errors.funding_amount}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Grid sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // Disable save button if editing and no changes made or mutation is loading
            disabled={
              (!isNewOverride && !isDirty) || isMutationLoading || !isValid
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default OverrideFundingForm;
