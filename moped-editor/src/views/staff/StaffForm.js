import React, { useState } from "react";
import { formatApiErrors, fieldParsers } from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WORKGROUPS_QUERY } from "../../queries/workgroups";

import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";
import StaffFormErrorModal from "./StaffFormErrorModal";
import StaffFormConfirmModal from "./StaffFormConfirmModal";
import StaffUpdateUserStatusButtons from "./StaffUpdateUserStatusButtons";

const useStyles = makeStyles(() => ({
  formSelect: {
    minWidth: 195,
  },
  hiddenTextField: {
    display: "none",
  },
}));

const roles = [
  { value: "moped-viewer", name: "Viewer" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

/**
 * Generates a StaffForm Component
 * @param {Object} editFormData - The form data
 * @param {string} userCognitoId - The User's Cognito UUID (if available)
 * @returns {JSX.Element}
 * @constructor
 */
const StaffForm = ({
  editFormData = null,
  userCognitoId,
  onFormSubmit,
  apiErrors,
  setApiError,
  isRequesting,
  initialFormValues,
  showUpdateUserStatusButtons,
  isUserActive,
  showFormResetButton,
  validationSchema,
  setLoading,
}) => {
  const classes = useStyles();
  const is_deleted = editFormData?.is_deleted;

  const initialModalState = {
    open: false,
    title: null,
    message: null,
    action: null,
    actionButtonLabel: "Yes",
    hideActionButton: false,
    hideCloseButton: false,
  };

  const [modalState, setModalState] = useState(initialModalState);

  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    getValues,
    formState,
    reset,
  } = useForm({
    defaultValues: initialFormValues,
    resolver: yupResolver(validationSchema),
  });

  const { isSubmitting, dirtyFields } = formState;

  /**
   * Controls the onSubmit data event
   * @param {Object} data - The data being submitted
   */
  const onSubmit = (data) => {
    // Parse values with fns from config
    Object.entries(fieldParsers).forEach(([fieldName, parser]) => {
      const originalValue = data[fieldName];
      const parsedValue = parser(originalValue);

      data[fieldName] = parsedValue;
    });

    // Remove unedited values from the payload
    Object.keys(data).forEach((field) => {
      if (!dirtyFields.hasOwnProperty(field)) {
        delete data[field];
      }
    });

    onFormSubmit(data);
  };

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);

  /**
   * Updates the workgroup field state
   * @param {Object} e - Event
   * @returns {string} - The workgroup name
   */
  const updateWorkgroupFields = (e) => {
    const workgroupId = e.nativeEvent.target.dataset.id;
    const workgroupName = e.target.value;

    // When workgroup field updates, set corresponding workgroup_id value
    setValue("workgroup_id", workgroupId);

    // React Hook Form expects the custom onChange action to return workgroup field value
    return workgroupName;
  };

  /**
   * Closes the modal
   */
  const handleCloseModal = () => {
    setModalState(initialModalState);
  };

  /**
   * Clears the API errors window and closes it
   */
  const clearApiErrors = () => {
    setApiError(null);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="first_name"
            id="first-name"
            label="First Name"
            disabled={is_deleted === true}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.first_name || !!apiErrors?.first_name}
            helperText={
              errors.first_name?.message ||
              formatApiErrors(apiErrors?.first_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="last_name"
            id="last-name"
            label="Last Name"
            disabled={is_deleted === true}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.last_name || !!apiErrors?.last_name}
            helperText={
              errors.last_name?.message || formatApiErrors(apiErrors?.last_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="title"
            id="title"
            label="Title"
            disabled={is_deleted === true}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.title || !!apiErrors?.title}
            helperText={
              errors.title?.message || formatApiErrors(apiErrors?.title)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            id="email"
            label="Email"
            disabled={is_deleted === true}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.email || !!apiErrors?.email}
            helperText={
              errors.email?.message || formatApiErrors(apiErrors?.email)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="password"
            id="password"
            label="Password"
            type="password"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.password || !!apiErrors?.password}
            helperText={
              errors.password?.message || formatApiErrors(apiErrors?.password)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {workgroupLoading ? (
            <CircularProgress />
          ) : (
            <FormControl variant="outlined" className={classes.formSelect}>
              <InputLabel id="workgroup-label">Workgroup</InputLabel>
              <Controller
                render={({ onChange, ref, value }) => (
                  <Select
                    id="workgroup"
                    labelId="workgroup-label"
                    label="Workgroup"
                    disabled={is_deleted === true}
                    onChange={(e) => onChange(updateWorkgroupFields(e))}
                    inputRef={ref}
                    value={value}
                  >
                    {workgroups.moped_workgroup.map((workgroup) => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_name}
                        data-id={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={"workgroup"}
                control={control}
              />
              {workgroupError && (
                <FormHelperText>
                  Workgroups failed to load. Please refresh.
                </FormHelperText>
              )}
              {errors.workgroup && (
                <FormHelperText>{errors.workgroup?.message}</FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
        {/* This hidden field is populated with workgroup_id field by updateWorkgroupFields() */}
        <TextField
          id="workgroup-id"
          name="workgroup_id"
          inputRef={register}
          className={classes.hiddenTextField}
        />
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel id="roles-label">Role</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="roles" name="roles">
                  {roles.map((role) => (
                    <FormControlLabel
                      key={role.value}
                      value={role.value}
                      control={<Radio />}
                      label={role.name}
                      disabled={is_deleted === true}
                    />
                  ))}
                </RadioGroup>
              }
              name={"roles"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          &nbsp;
        </Grid>
        <Grid item xs={12} md={6}>
          {!apiErrors && (isRequesting || isSubmitting) ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                className={classes.formButton}
                style={is_deleted === true ? { display: "none" } : {}}
                disabled={isSubmitting}
                type="submit"
                color="primary"
                variant="contained"
              >
                Save
              </Button>
              {showFormResetButton && (
                <Button
                  className={classes.formButton}
                  color="secondary"
                  variant="contained"
                  onClick={() => reset(initialFormValues)}
                >
                  Reset
                </Button>
              )}
              {showUpdateUserStatusButtons && (
                <StaffUpdateUserStatusButtons
                  isUserActive={isUserActive}
                  handleCloseModal={handleCloseModal}
                  email={getValues("email")}
                  password={getValues("password")}
                  roles={getValues("roles")}
                />
              )}
            </>
          )}
          <StaffFormConfirmModal
            isLoading={isRequesting}
            title={modalState.title}
            message={modalState.message}
            open={modalState.open}
            onClose={handleCloseModal}
            action={modalState.action}
            actionButtonLabel={modalState.actionButtonLabel}
            hideCloseButton={modalState.hideActionButton}
            hideActionButton={modalState.hideActionButton}
          />
          <StaffFormErrorModal isOpen={!!apiErrors} onClose={clearApiErrors} />
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
