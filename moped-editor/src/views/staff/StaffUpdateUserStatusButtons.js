import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useUserApi,
  roleLooksGood,
  passwordLooksGood,
  fieldParsers,
} from "./helpers";

import { Button, Typography, Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
  formButtonGreen: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

/**
 * Generates a StaffForm Component
 * @param {Object} editFormData - The form data
 * @param {string} userCognitoId - The User's Cognito UUID (if available)
 * @returns {JSX.Element}
 * @constructor
 */
const StaffUpdateUserStatusButtons = ({
  userCognitoId,
  setModalState,
  handleCloseModal,
  email,
  password,
  roles,
  isUserActive,
}) => {
  const classes = useStyles();
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const { requestApi } = useUserApi();

  /**
   * Send a request to the user activation route of the Moped API
   */
  const handleUserActivation = () => {
    const rolesParser = fieldParsers["roles"];
    // The backend uses an array for roles
    const rolesArray = rolesParser(roles);

    const data = {
      email,
      password,
      roles: rolesArray,
    };

    // Navigate to user table on success
    const callback = () => navigate("/moped/staff");

    requestApi({
      method: "put",
      path: "/users/activate/",
      payload: data,
      callback,
    });
  };

  /**
   * Handler for Delete Confirm button
   */
  const handleDeleteConfirm = () => {
    const requestPath = "/users/" + userCognitoId;
    const deleteCallback = () => {
      handleCloseModal();
      navigate("/moped/staff/");
    };

    requestApi({
      method: "delete",
      path: requestPath,
      callback: deleteCallback,
    });
  };

  /**
   * Handle Activate User Confirm
   */
  const handleActivateConfirm = () => {
    if (!passwordLooksGood(password)) {
      setModalState({
        open: true,
        title: "Error",
        message: (
          <Typography>
            The password is required when activating a user. It needs to be 8
            characters long, it must include at least one lower-case,
            upper-case, one number, and one symbol characters.
          </Typography>
        ),
        action: handleCloseModal,
        actionButtonLabel: "Ok",
        hideCloseButton: true,
      });
    } else if (!roleLooksGood(roles)) {
      setModalState({
        open: true,
        title: "Error",
        message: "The role is required when activating a user.",
        action: handleCloseModal,
        actionButtonLabel: "Ok",
        hideCloseButton: true,
      });
    } else {
      handleUserActivation();
      setModalState({
        open: true,
        title: "Activating",
        message: (
          <Box display="flex" justifyContent="flex-start">
            <Typography>Please Wait...</Typography>
          </Box>
        ),
        action: handleCloseModal,
        actionButtonLabel: null,
        hideActionButton: true,
        hideCloseButton: true,
      });
    }
  };

  /**
   * Activate User
   */
  const handleActivateUser = () => {
    setModalState({
      open: true,
      title: "Activate user?",
      message: "Do you want to activate this user?",
      action: handleActivateConfirm,
    });
  };

  /**
   * Handles the deactivation of user
   */
  const handleDeactivateUser = () => {
    setModalState({
      open: true,
      title: "Inactivate this user?",
      message: "Are you sure that you want to inactivate this user?",
      action: handleDeleteConfirm,
    });
  };

  return (
    <>
      {isUserActive === false && (
        <Button
          className={classes.formButton}
          color="secondary"
          variant="contained"
          onClick={handleDeactivateUser}
        >
          Inactivate User
        </Button>
      )}
      {isUserActive === true && (
        <Button
          className={clsx(classes.formButton, classes.formButtonGreen)}
          variant="contained"
          onClick={handleActivateUser}
        >
          Activate User
        </Button>
      )}
    </>
  );
};

export default StaffUpdateUserStatusButtons;
