import { useMutation, useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import { currencyFormatter } from "src/utils/numberFormatters";
import { filterOptions } from "src/utils/autocompleteHelpers";
import {
  ADD_PROJECT_FUNDING,
  ECAPRIS_SUBPROJECT_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
} from "src/queries/funding";
import { transformGridToDatabase } from "src/views/projects/projectView/ProjectFunding/helpers";
import { amountOnChangeHandler } from "src/views/projects/projectView/ProjectWorkActivity/utils/form";
import * as yup from "yup";

const validationSchema = ({ appropriatedFunding }) =>
  yup.object().shape({
    funding_amount: yup
      .number()
      .test(
        "lessThanAppropriated",
        `Amount cannot exceed appropriated amount of ${currencyFormatter.format(appropriatedFunding)}`,
        function (value) {
          return value <= appropriatedFunding;
        }
      )
      .test(
        "differentFromAppropriated",
        `Amount must be different from appropriated amount of ${currencyFormatter.format(appropriatedFunding)} if overriding`,
        function (value) {
          return value !== appropriatedFunding;
        }
      )
      .nullable(),
  });

const renderECaprisLabel = (lookup, recordId, recordType) => {
  const fundingRecord = lookup.find(
    (option) => option[`funding_${recordType}_id`] === recordId
  );
  return fundingRecord && fundingRecord[`funding_${recordType}_name`]
    ? fundingRecord[`funding_${recordType}_name`]
    : "-";
};

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  onClose,
  dataProjectFunding,
}) => {
  const { data: fduData } = useQuery(ECAPRIS_SUBPROJECT_FUNDING_QUERY, {
    variables: { fdu: fundingRecord.fdu.fdu },
  });

  const appropriatedFunding = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["amount"]
    : 0;

  const ecaprisSourceId = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["funding_source_id"]
    : null;

  const ecaprisProgramId = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["funding_program_id"]
    : null;

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      funding_amount: fundingRecord.funding_amount ?? 0,
      description: fundingRecord.funding_description ?? "",
      should_use_ecapris_amount: fundingRecord?.should_use_ecapris_amount,
      funding_source_id: fundingRecord.fund_source?.funding_source_id,
      funding_program_id: fundingRecord.fund_program?.funding_program_id,
    },
    resolver: yupResolver(validationSchema({ appropriatedFunding })),
    mode: "onChange",
  });

  const [should_use_ecapris_amount] = watch(["should_use_ecapris_amount"]);

  // if record is synced from ecapris and not yet manual, its first time overriding amount and description
  const isNewOverride =
    fundingRecord.is_synced_from_ecapris && !fundingRecord.is_manual;

  const [mutate, mutationState] = useMutation(
    isNewOverride ? ADD_PROJECT_FUNDING : UPDATE_PROJECT_FUNDING
  );

  const onSubmit = (data) => {
    const transformedRecord = transformGridToDatabase(fundingRecord);
    // override record with data from form
    transformedRecord.funding_description = data.description;
    transformedRecord.funding_amount = data.funding_amount;
    transformedRecord.should_use_ecapris_amount =
      data.should_use_ecapris_amount;
    transformedRecord.funding_source_id = data.funding_source_id;
    transformedRecord.funding_program_id = data.funding_program_id;

    const payload = isNewOverride
      ? {
          objects: {
            ...transformedRecord,
            ecapris_subproject_id: fundingRecord.ecapris_subproject_id,
            project_id: Number(projectId),
          },
        }
      : {
          ...transformedRecord,
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
        onClose();
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="should_use_ecapris_amount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Switch
                    // Invert value for switch so that "on" means we are overriding and NOT using eCAPRIS amount
                    checked={!value}
                    onChange={(e) => {
                      // Check target value so we can restore previous amount if unchecking (if there is one)
                      if (e.target.checked) {
                        setValue(
                          "funding_amount",
                          fundingRecord.funding_amount ?? appropriatedFunding
                        );
                        onChange(false);
                      } else {
                        setValue("funding_amount", appropriatedFunding);
                        onChange(true);
                      }
                    }}
                  />
                }
                label="Override eCAPRIS appropriated amount"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              autoFocus
              label="Amount"
              name="funding_amount"
              control={control}
              size="small"
              type="text"
              inputMode="numeric"
              onChangeHandler={amountOnChangeHandler}
              disabled={should_use_ecapris_amount}
            />
            <FormHelperText>
              eCAPRIS appropriated amount:{" "}
              {currencyFormatter.format(appropriatedFunding)}
            </FormHelperText>
            {errors.funding_amount ? (
              <FormHelperText error>
                {errors.funding_amount?.message}
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="funding_source_id"
              label="Source"
              options={dataProjectFunding["moped_fund_sources"]}
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
                  ? dataProjectFunding["moped_fund_sources"].find(
                      (s) => s.funding_source_id === value
                    )
                  : null
              }
            />
            <FormHelperText>
              eCAPRIS source:{" "}
              {renderECaprisLabel(
                dataProjectFunding["moped_fund_sources"],
                ecaprisSourceId,
                "source"
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="funding_program_id"
              label="Program"
              options={dataProjectFunding["moped_fund_programs"]}
              filterOptions={filterOptions}
              getOptionLabel={(option) => option?.funding_program_name || ""}
              onChangeHandler={(fund_source, field) => {
                return field.onChange(fund_source?.funding_program_id || null);
              }}
              isOptionEqualToValue={(option, selectedOption) =>
                option.funding_program_id === selectedOption.funding_program_id
              }
              valueHandler={(value) =>
                value
                  ? dataProjectFunding["moped_fund_programs"].find(
                      (s) => s.funding_program_id === value
                    )
                  : null
              }
            />
            <FormHelperText>
              eCAPRIS program:{" "}
              {renderECaprisLabel(
                dataProjectFunding["moped_fund_programs"],
                ecaprisProgramId,
                "program"
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // Disable save button if editing and no changes made or mutation is loading
            disabled={(!isNewOverride && !isDirty) || mutationState.loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default OverrideFundingForm;
