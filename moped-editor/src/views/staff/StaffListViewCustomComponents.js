import React from "react";
import Can from "../../auth/Can";
import Alert from "@mui/material/Alert";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Email from "@mui/icons-material/Email";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Snackbar from "@mui/material/Snackbar";
import { NavLink as RouterLink } from "react-router-dom";

export const AddUserButton = () => (
  <Can
    perform="user:create"
    yes={
      <Button
        color="primary"
        variant="contained"
        size="small"
        component={RouterLink}
        to={"/moped/staff/new"}
        startIcon={<Icon>add_circle</Icon>}
      >
        Add Staff
      </Button>
    }
  />
);

export const EditUserButton = ({ id }) => (
  <Can
    perform="user:edit"
    yes={
      <RouterLink to={`/moped/staff/edit/${id}`}>
        <EditOutlinedIcon color="primary" />
      </RouterLink>
    }
  />
);

const writeTextToClipboard = (text, onSuccessCallback) => {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data).then(
    () => onSuccessCallback(),
    () => console.error("Something went wrong :/")
  );
};

const onCopyAllEmails = (users) => {
  debugger;
  const emailString = users
    ?.filter((u) => !u.is_deleted)
    .map((u) => u.email)
    .join(";");
  writeTextToClipboard(emailString, () => console.log("success"));
};

const onCopyMugEmails = (users) => {
  const emailString = users
    ?.filter((u) => u.is_user_group_member && !u.is_deleted)
    .map((u) => u.email)
    .join(";");
  writeTextToClipboard(emailString, () => console.log("success"));
};

export const CopyMugUsersButton = ({ users }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  console.log("USERS", users);
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleMenuClick}
        startIcon={<Email />}
      >
        Copy email addresses
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Moped User Group</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>All active users</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
};
