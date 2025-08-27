import React from "react";
import { green } from "@mui/material/colors";
import { Icon, Button, CircularProgress, Box } from "@mui/material";

/**
 * ProjectSaveButton - A button that shows an animated status when saving.
 * https://material-ui.com/components/progress/#interactive-integration
 * @param {str} label - The string to show within the button
 * @param {bool} loading - When true, it forces the button show loading spinner status.
 * @param {bool} success - Then true, it forces the button to show green status with checkmark.
 * @param {function} handleButtonClick - The onClick handler
 * @return {JSX.Element}
 */
export default function ProjectSaveButton({
  label,
  loading,
  success,
  handleButtonClick,
  disabled,
  buttonOptions = {},
}) {
  return (
    <Box
      sx={{
        margin: 1,
        position: "relative",
        marginRight: 0,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        disabled={(loading && !success) || disabled}
        onClick={success ? null : handleButtonClick}
        sx={{
          ...(success && {
            backgroundColor: green[500],
            "&:hover": {
              backgroundColor: green[500],
            },
            disabled: true,
            cursor: "default",
          }),
        }}
        {...buttonOptions}
      >
        {success ? <Icon>check</Icon> : label}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
}
