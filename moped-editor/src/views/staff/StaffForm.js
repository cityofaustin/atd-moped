import React, { useState } from "react";
import { formatApiErrors, transformFormDataIntoDatabaseTypes } from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WORKGROUPS_QUERY } from "../../queries/workgroups";
import { findHighestRole } from "../../auth/user";

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
import StaffFormErrorModal from "./components/StaffFormErrorModal";
import StaffFormConfirmModal from "./components/StaffFormConfirmModal";
import StaffUpdateUserStatusButtons from "./components/StaffUpdateUserStatusButtons";

const useStyles = makeStyles((theme) => ({
  formSelect: {
    minWidth: 195,
  },
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
  hiddenTextField: {
    display: "none",
  },
}));

const roleOptions = [
  { value: "moped-viewer", name: "Viewer" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

/**
 * Generates a StaffForm Component
 * @param {Object} initialFormValues - The form data
 * @param {function} onFormSubmit - callback fired when submit button is clicked
 * @param {Object} userApiErrors - any errors returned from the Moped API user routes
 * @param {function} setUserApiError - modify or clear Moped API user routes errors
 * @param {boolean} isUserApiLoading - Moped API user route API call loading state
 * @param {function} setIsUserApiLoading - modify Moped API user route API call loading state
 * @param {boolean} showUpdateUserStatusButtons - show/hide user activate/deactivate button
 * @param {boolean} showFormResetButton - show/hide form values reset button
 * @param {Object} validationSchema - Yup formatted form validation schema
 * @param {string} userCognitoId - The User's Cognito UUID (if available)
 * @param {boolean} isUserActive - is existing user active or inactive
 * @returns {JSX.Element}
 * @constructor
 */
const StaffForm = ({
  initialFormValues,
  onFormSubmit,
  userApiErrors,
  setUserApiError,
  isUserApiLoading,
  setIsUserApiLoading,
  showUpdateUserStatusButtons,
  showFormResetButton,
  validationSchema,
  userCognitoId,
  isUserActive = true,
}) => {
  const classes = useStyles();

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
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      ...initialFormValues,
      // Roles are stored as an array in the DB but we need to feed the form a string
      roles: findHighestRole(initialFormValues.roles),
    },
    resolver: yupResolver(validationSchema),
  });

  /**
   * Controls the onSubmit data event
   * @param {Object} data - The data being submitted
   */
  const onSubmit = (data) => {
    // Parse data and remove unchanged values
    const databaseData = transformFormDataIntoDatabaseTypes(data);

    onFormSubmit(databaseData);
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
    setUserApiError(null);
    setIsUserApiLoading(false);
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
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.first_name || !!userApiErrors?.first_name}
            helperText={
              errors.first_name?.message ||
              formatApiErrors(userApiErrors?.first_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="last_name"
            id="last-name"
            label="Last Name"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.last_name || !!userApiErrors?.last_name}
            helperText={
              errors.last_name?.message ||
              formatApiErrors(userApiErrors?.last_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="title"
            id="title"
            label="Title"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.title || !!userApiErrors?.title}
            helperText={
              errors.title?.message || formatApiErrors(userApiErrors?.title)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            id="email"
            label="Email"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.email || !!userApiErrors?.email}
            helperText={
              errors.email?.message || formatApiErrors(userApiErrors?.email)
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
            error={!!errors.password || !!userApiErrors?.password}
            helperText={
              errors.password?.message ||
              formatApiErrors(userApiErrors?.password)
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
                    disabled={!isUserActive}
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
                  {roleOptions.map((role) => (
                    <FormControlLabel
                      key={role.value}
                      value={role.value}
                      control={<Radio />}
                      label={role.name}
                      disabled={!isUserActive}
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
          {!userApiErrors && (isUserApiLoading || isSubmitting) ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                className={classes.formButton}
                style={!isUserActive ? { display: "none" } : {}}
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
                  email={watch("email")}
                  password={watch("password")}
                  roles={watch("roles")}
                  userCognitoId={userCognitoId}
                  setModalState={setModalState}
                />
              )}
            </>
          )}
          <StaffFormConfirmModal
            isLoading={isUserApiLoading}
            title={modalState.title}
            message={modalState.message}
            open={modalState.open}
            onClose={handleCloseModal}
            action={modalState.action}
            actionButtonLabel={modalState.actionButtonLabel}
            hideCloseButton={modalState.hideActionButton}
            hideActionButton={modalState.hideActionButton}
          />
          <StaffFormErrorModal
            isOpen={!!userApiErrors}
            onClose={clearApiErrors}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
