import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useUserApi,
  roleLooksGood,
  passwordLooksGood,
  fieldParsers,
} from "../helpers";
import { useButtonStyles } from "./StaffFormButtons";

import { Button, Typography, Box } from "@material-ui/core";
import clsx from "clsx";

/**
 * Generates a button to inactivate or activate an existing user AND register/activate a non-login user
 * @param {function} setModalState - set the modal's details
 * @param {function} handleCloseModal - callback that fires on modal close
 * @param {string} email - user's email
 * @param {string} password - new password required in form for user activate
 * @param {array} roles - user roles to create DynamoDB claims entry
 * @returns {JSX.Element}
 */
const NonLoginUserActivationButtons = ({
  setModalState,
  handleCloseModal,
  email,
  password,
  roles,
}) => {
  const classes = useButtonStyles();
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const { requestApi } = useUserApi();

  /**
   * Send a request to the user activation route of the Moped API
   */
  const handleNonLoginUserActivation = () => {
    const rolesParser = fieldParsers["roles"];
    // Promote user role to editor since we are activating a non-login user
    const rolesArray = rolesParser("moped-editor");

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
   * Handle Activate Non-login User Confirm
   */
  const handleActivateNonLoginUserConfirm = () => {
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
      handleNonLoginUserActivation();
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
   * Handles the activation of a non-login user
   */
  const handleActivateNonLoginUser = () => {
    setModalState({
      open: true,
      title: "Activate this non-login user?",
      message: "Do you want to activate this non-login user?",
      action: handleActivateNonLoginUserConfirm,
    });
  };

  return (
    <>
      <Button
        className={clsx(classes.formButton, classes.formButtonGreen)}
        variant="contained"
        onClick={handleActivateNonLoginUser}
      >
        Activate Non-login User
      </Button>
    </>
  );
};

export default NonLoginUserActivationButtons;
