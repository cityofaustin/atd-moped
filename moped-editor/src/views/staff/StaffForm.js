import React, { useState } from "react";
import {
  formatApiErrors,
  transformFormDataIntoDatabaseTypes,
  nonLoginUserRole,
} from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WORKGROUPS_QUERY } from "../../queries/workgroups";
import { findHighestRole } from "../../auth/user";

import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import StaffFormErrorModal from "./components/StaffFormErrorModal";
import StaffFormConfirmModal from "./components/StaffFormConfirmModal";

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

/**
 * Generates a StaffForm Component
 * @param {Object} initialFormValues - The form data
 * @param {function} onFormSubmit - callback fired when submit button is clicked
 * @param {Object} userApiErrors - any errors returned from the Moped API user routes
 * @param {function} setUserApiError - modify or clear Moped API user routes errors
 * @param {boolean} isUserApiLoading - Moped API user route API call loading state
 * @param {function} setIsUserApiLoading - modify Moped API user route API call loading state
 * @param {Object} validationSchema - Yup formatted form validation schema
 * @param {boolean} isUserActive - is existing user active or inactive
 * @param {array} roleOptions - role options to present in the form
 * @param {boolean} isPasswordFieldDisabled - disable password field when not required
 * @param {function} FormButtons - React function components that renders form action buttons
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
  validationSchema,
  isUserActive = true,
  roleOptions,
  isPasswordFieldDisabled,
  FormButtons,
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
    control,
    watch,
    formState: { isSubmitting, errors },
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

  const currentSelectedRole = watch("roles");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            autoFocus
            id="first-name"
            label="First Name"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register("first_name")}
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
            id="last-name"
            label="Last Name"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register("last_name")}
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
            id="title"
            label="Title"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register("title")}
            error={!!errors.title || !!userApiErrors?.title}
            helperText={
              errors.title?.message || formatApiErrors(userApiErrors?.title)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            disabled={!isUserActive}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register("email")}
            error={!!errors.email || !!userApiErrors?.email}
            helperText={
              errors.email?.message || formatApiErrors(userApiErrors?.email)
            }
          />
        </Grid>
        {/* Non-Moped Users are not added to the Cognito pool so they do not need a password */}
        <Grid item xs={12} md={6}>
          {isPasswordFieldDisabled === false ||
          currentSelectedRole !== nonLoginUserRole ? (
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              {...register("password")}
              error={!!errors.password || !!userApiErrors?.password}
              helperText={
                errors.password?.message ||
                formatApiErrors(userApiErrors?.password)
              }
            />
          ) : (
            <TextField
              fullWidth
              id="password"
              label="Password"
              disabled={true}
              {...register("password")}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              error={!!errors.password || !!userApiErrors?.password}
              helperText={"Password not required for non-login users"}
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {workgroupLoading ? (
            <CircularProgress />
          ) : (
            <FormControl variant="outlined" className={classes.formSelect}>
              <InputLabel id="workgroup-label">Workgroup</InputLabel>
              <Controller
                name="workgroup_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ""}
                    variant="outlined"
                    id="workgroup_id"
                    labelId="workgroup-label"
                    label="Workgroup"
                    disabled={!isUserActive}
                    onChange={(e) => {
                      field.onChange(e.target.value ?? "");
                    }}
                    error={
                      !!errors.workgroup_id || !!userApiErrors?.workgroup_id
                    }
                  >
                    {workgroups.moped_workgroup.map((workgroup) => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {workgroupError && (
                <FormHelperText>
                  Workgroups failed to load. Please refresh.
                </FormHelperText>
              )}
              {errors.workgroup_id && (
                <FormHelperText
                  error={!!errors.workgroup_id || !!userApiErrors?.workgroup_id}
                >
                  {errors.workgroup_id?.message ||
                    formatApiErrors(userApiErrors?.workgroup_id)}
                </FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl variant="standard" component="fieldset">
            <FormLabel id="roles-label">Role</FormLabel>
            <Controller
              name="roles"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <RadioGroup
                  aria-label="roles"
                  name={name}
                  value={value}
                  onChange={onChange}
                >
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
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl variant="standard" component="fieldset">
            <FormLabel id="roles-label">
              Moped User Group (MUG) Member
            </FormLabel>
            <Controller
              name="is_user_group_member"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <RadioGroup
                  aria-label="roles"
                  name={name}
                  value={value ? "true" : "false"}
                  onChange={(e) => {
                    const newValue = e.target.value === "true";
                    return onChange(newValue);
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                    disabled={!isUserActive}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                    disabled={!isUserActive}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            id="note"
            label="Note"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            {...register("note")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          &nbsp;
        </Grid>
        <Grid item xs={12} md={6}>
          {!userApiErrors && (isUserApiLoading || isSubmitting) ? (
            <CircularProgress />
          ) : (
            <FormButtons
              isSubmitting={isSubmitting}
              reset={reset}
              handleCloseModal={handleCloseModal}
              setModalState={setModalState}
              watch={watch}
            />
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
