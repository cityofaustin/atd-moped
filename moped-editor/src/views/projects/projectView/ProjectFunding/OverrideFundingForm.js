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
import { currencyFormatter } from "src/utils/numberFormatters";
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
      .nullable(),
  });

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  refetchFundingQuery,
  setOverrideFundingRecord,
  handleSnackbar,
  onClose,
}) => {
  const { data: fduData } = useQuery(ECAPRIS_SUBPROJECT_FUNDING_QUERY, {
    variables: { fdu: fundingRecord?.fdu?.fdu },
  });

  const appropriatedFunding = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["amount"]
    : 0;

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      funding_amount: fundingRecord?.funding_amount ?? 0,
      description: fundingRecord?.funding_description ?? "",
      should_use_ecapris_amount: fundingRecord?.should_use_ecapris_amount,
    },
    resolver: yupResolver(validationSchema({ appropriatedFunding })),
    mode: "onChange",
  });

  const [should_use_ecapris_amount] = watch(["should_use_ecapris_amount"]);

  // if record is synced from ecapris and not yet manual, its first time overriding amount and description
  const isNewOverride =
    fundingRecord.is_synced_from_ecapris && !fundingRecord.is_manual;

  const [mutate] = useMutation(
    isNewOverride ? ADD_PROJECT_FUNDING : UPDATE_PROJECT_FUNDING
  );

  const onSubmit = (data) => {
    const transformedRecord = transformGridToDatabase(fundingRecord);
    // override record with data from form
    transformedRecord.funding_description = data.description;
    transformedRecord.funding_amount = data.funding_amount;
    transformedRecord.should_use_ecapris_amount =
      data.should_use_ecapris_amount;

    if (isNewOverride) {
      mutate({
        variables: {
          objects: {
            ...transformedRecord,
            ecapris_subproject_id: fundingRecord.ecapris_subproject_id,
            project_id: Number(projectId),
          },
        },
      })
        .then(() => {
          handleSnackbar(true, "Funding source added", "success");
          refetchFundingQuery();
          setOverrideFundingRecord(null);
          onClose();
        })
        .catch((error) => {
          handleSnackbar(true, "Error adding funding source", "error", error);
        });
    } else {
      mutate({
        variables: {
          ...transformedRecord,
          proj_funding_id: fundingRecord.proj_funding_id,
        },
      })
        .then(() => {
          handleSnackbar(true, "Funding source updated", "success");
          refetchFundingQuery();
          setOverrideFundingRecord(null);
          onClose();
        })
        .catch((error) => {
          handleSnackbar(true, "Error updating funding source", "error", error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
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
              eCapris appropriated amount:{" "}
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
          <Controller
            name="should_use_ecapris_amount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => {
                      // Check target value so we can restore previous amount if unchecking (if there is one)
                      if (e.target.checked) {
                        setValue("funding_amount", appropriatedFunding);
                        onChange(e);
                      } else {
                        setValue(
                          "funding_amount",
                          fundingRecord.funding_amount ?? appropriatedFunding
                        );
                        onChange(e);
                      }
                    }}
                  />
                }
                label="Use latest eCAPRIS appropriated amount"
              />
            )}
          />
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
      </Grid>
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default OverrideFundingForm;
