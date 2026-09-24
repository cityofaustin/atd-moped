import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm, useWatch } from "react-hook-form";
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
import { nullIfSameAsEcapris } from "src/views/projects/projectView/ProjectFunding/helpers";
import * as yup from "yup";

const validationSchema = ({ appropriatedFunding }) =>
  yup.object().shape({
    funding_amount: yup
      .number()
      .nullable()
      .test(
        "lessThanAppropriated",
        `Amount cannot exceed appropriated amount of ${currencyFormatter.format(
          appropriatedFunding
        )}`,
        function (value) {
          if (value === null || appropriatedFunding === null) return true;
          return value <= appropriatedFunding;
        }
      )
      .test(
        "differentFromAppropriated",
        `Amount must be different from appropriated amount of ${currencyFormatter.format(appropriatedFunding)} if overriding`,
        function (value) {
          if (value === null || appropriatedFunding === null) return true;
          return value !== appropriatedFunding;
        }
      ),
  });

const findLookupName = (lookup, recordId, recordType) => {
  const fundingRecord = lookup.find(
    (option) => option[`funding_${recordType}_id`] === recordId
  );
  return fundingRecord?.[`funding_${recordType}_name`] ?? null;
};

/**
 * Keeps only digits so a formatted amount like $86,753.09 is stored as 86753
 * @param {string} value - the current input value
 * @param {Object} field - the react-hook-form field object
 */
const amountOnChangeHandler = (value, field) => {
  const integerValue = value
    ? removeNonIntegers(removeDecimalsAndTrailingNumbers(value))
    : "";
  field.onChange(integerValue === "" ? null : Number(integerValue));
};

const amountValueHandler = (value) =>
  value === null || value === undefined ? "" : currencyFormatter.format(value);

/**
 * Wraps an input whose value overrides an eCAPRIS value. When the input is empty and unfocused,
 * the eCAPRIS value shows in place of the label so it reads as the inherited value.
 * @param {string} fieldLabel - label shown when the input is focused or has an override value
 * @param {string|null} ecaprisValueLabel - eCAPRIS value shown as the label when inherited
 * @param {string} ecaprisHelperText - reference text shown below the input
 * @param {boolean} hasOverride - if the input has a value that overrides the eCAPRIS value
 * @param {function} onRevert - clears the override value so the eCAPRIS value is inherited
 * @param {string} errorMessage - optional validation error message
 * @param {function} renderInput - renders the input given the label to display
 */
const EcaprisOverridableField = ({
  fieldLabel,
  ecaprisValueLabel,
  ecaprisHelperText,
  hasOverride,
  onRevert,
  errorMessage,
  renderInput,
}) => {
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

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  handleClose,
  dataLookups,
}) => {
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
  } = useForm({
    // Values stored in moped_proj_funding are overrides; null means the eCAPRIS value is inherited
    defaultValues: {
      funding_amount: fundingRecord.moped_funding_amount ?? null,
      description: fundingRecord.funding_description ?? "",
      funding_source_id: fundingRecord.moped_funding_source_id ?? null,
      funding_program_id: fundingRecord.moped_funding_program_id ?? null,
      fund_status: fundingRecord.moped_fund_status?.funding_status_id,
    },
    resolver: yupResolver(validationSchema({ appropriatedFunding })),
    mode: "onChange",
  });

  const [fundingAmount, fundingSourceId, fundingProgramId] = useWatch({
    control,
    name: ["funding_amount", "funding_source_id", "funding_program_id"],
  });

  const revertField = (name) =>
    setValue(name, null, { shouldDirty: true, shouldValidate: true });

  // if record is synced from ecapris and not yet manual, its first time overriding amount and description
  const isNewOverride =
    fundingRecord.is_synced_from_ecapris && !fundingRecord.is_manual;
  const fundingSources = dataLookups["moped_fund_sources"];
  const fundingPrograms = dataLookups["moped_fund_programs"];

  const ecaprisSourceName = findLookupName(
    fundingSources,
    ecaprisSourceId,
    "source"
  );
  const ecaprisProgramName = findLookupName(
    fundingPrograms,
    ecaprisProgramId,
    "program"
  );
  const ecaprisAmountLabel =
    appropriatedFunding === null
      ? null
      : currencyFormatter.format(appropriatedFunding);

  const [mutate, mutationState] = useMutation(
    isNewOverride ? ADD_PROJECT_FUNDING_AND_REATTACH : UPDATE_PROJECT_FUNDING
  );

  const onSubmit = (data) => {
    const fundingValues = {
      fdu: fundingRecord.fdu.fdu,
      unit_long_name: fundingRecord.fdu.unit_long_name,
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

    const fileAttachmentObjects = fundingRecord.ecapris_funding_files.map(
      (file) => ({ file_id: file.moped_project_file.project_file_id })
    );

    const payload = isNewOverride
      ? {
          fundingObjects: {
            ...fundingValues,
            ecapris_funding_id: fundingRecord.fdu.ecapris_funding_id,
            ecapris_subproject_id: fundingRecord.ecapris_subproject_id,
            project_id: Number(projectId),
            files_project_fundings: { data: fileAttachmentObjects },
          },
          entityId: fundingRecord.proj_funding_id,
          projectId,
        }
      : {
          ...fundingValues,
          proj_funding_id: fundingRecord.proj_funding_id,
        };

    const snackbarVerb = isNewOverride ? "add" : "updat";

    mutate({
      variables: payload,
    })
      .then(() => {
        handleSnackbar(true, `Funding source ${snackbarVerb}ed`, "success");
        refetchFundingQuery();
        setOverrideFundingRecord(null);
        handleClose();
      })
      .catch((error) => {
        handleSnackbar(
          true,
          `Error ${snackbarVerb}ing funding source`,
          "error",
          error
        );
      });
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
              <ControlledAutocomplete
                control={control}
                name="funding_source_id"
                label={label}
                options={fundingSources}
                filterOptions={filterOptions}
                getOptionLabel={(option) => option?.funding_source_name || ""}
                onChangeHandler={(fund_source, field) => {
                  return field.onChange(fund_source?.funding_source_id || null);
                }}
                isOptionEqualToValue={(option, selectedOption) =>
                  option.funding_source_id === selectedOption.funding_source_id
                }
                valueHandler={(value) =>
                  value
                    ? fundingSources.find((s) => s.funding_source_id === value)
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
              <ControlledAutocomplete
                control={control}
                name="funding_program_id"
                label={label}
                options={fundingPrograms}
                filterOptions={filterOptions}
                getOptionLabel={(option) => option?.funding_program_name || ""}
                onChangeHandler={(fund_program, field) => {
                  return field.onChange(
                    fund_program?.funding_program_id || null
                  );
                }}
                isOptionEqualToValue={(option, selectedOption) =>
                  option.funding_program_id ===
                  selectedOption.funding_program_id
                }
                valueHandler={(value) =>
                  value
                    ? fundingPrograms.find(
                        (s) => s.funding_program_id === value
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
            <ControlledAutocomplete
              control={control}
              name="fund_status"
              label="Status"
              options={dataLookups["moped_fund_status"]}
              filterOptions={filterOptions}
              getOptionLabel={(option) => option?.funding_status_name || ""}
              onChangeHandler={(fund_status, field) => {
                return field.onChange(fund_status?.funding_status_id || 1);
              }}
              isOptionEqualToValue={(option, selectedOption) =>
                option.funding_status_id === selectedOption.funding_status_id
              }
              valueHandler={(value) =>
                value
                  ? dataLookups["moped_fund_status"].find(
                      (s) => s.funding_status_id === value
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
              (!isNewOverride && !isDirty) || mutationState.loading || !isValid
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
