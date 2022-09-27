import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_NON_MOPED_USER } from "src/queries/staff";
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
 * Generates a button to convert a non-login user to a Moped user with login
 * @param {function} setModalState - set the modal's details
 * @param {function} handleCloseModal - callback that fires on modal close
 * @param {string} userId - moped_user primary key user_id
 * @param {Object} formValues - User values from StaffForm
 * @returns {JSX.Element}
 */
const NonLoginUserActivationButtons = ({
  setModalState,
  handleCloseModal,
  userId,
  formValues,
}) => {
  const classes = useButtonStyles();
  let navigate = useNavigate();
  const { email, password, roles } = formValues;

  const { requestApi } = useUserApi();
  const [updateNonMopedUser] = useMutation(UPDATE_NON_MOPED_USER);

  /**
   * Use the user activation API route to convert to a Moped user in the Cognito user pool with a DynamoDB claims entry
   */
  const handleNonLoginUserActivation = () => {
    const rolesParser = fieldParsers["roles"];
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

  const handleUpdateNonLoginUser = () => {
    const { password, ...restOfFormValues } = formValues;

    updateNonMopedUser({
      variables: {
        userId: userId,
        changes: restOfFormValues,
      },
    }).then(() => navigate("/moped/staff"));
  };

  const handleActivateNonLoginUserConfirm = () => {
    if (!passwordLooksGood(password)) {
      setModalState({
        open: true,
        title: "Error",
        message: (
          <Typography>
            The password is required when activating a user. It needs to be 12
            characters long, and it must include at least one lowercase letter,
            one uppercase letter, one number, and one symbol character.
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
      {/* Need to create a save button to update only the moped_user row with a new mutation */}
      <Button
        className={classes.formButton}
        onClick={handleUpdateNonLoginUser}
        color="primary"
        variant="contained"
      >
        Save
      </Button>
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
