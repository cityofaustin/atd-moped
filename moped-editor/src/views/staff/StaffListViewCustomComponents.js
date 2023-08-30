import { useState, useEffect, useCallback } from "react";
import Can from "../../auth/Can";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
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

/**
 * Filter function to identify moped user group (MUG) members
 * @param {object} user - a `moped_user` object
 * @returns user
 */
const mugUserFilter = (user) => user.is_user_group_member && !user.is_deleted;

/**
 * Filter function to identify all active users who are not non-login users and
 * do not have a `+` in their email address
 * @param {object} user - a `moped_user` object
 * @returns user
 */
const allUserFilter = (user) =>
  !user.is_deleted &&
  !user.roles.includes("non-login-user") &&
  user.email.indexOf("+") < 0;

/**
 * Copies user email addresses to clipboard as a semi-colon-separated string
 * @param {object[]} users - array of `moped_user` bjects
 * @param {function} userFilter - filter function to apply to user array
 * @returns Promise to write data to clipboard
 */
const copyEmailsToClipboard = (users, userFilter) => {
  const emails = users
    .filter(userFilter)
    .map((u) => u.email)
    .join(";");
  const type = "text/plain";
  const blob = new Blob([emails], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  return navigator.clipboard.write(data);
};

/**
 * Menu component which copies Moped user emails to clipboard
 * @param {object[]} users - array of `moped_user` objects
 */
export const CopyMugUsersButton = ({ users }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copiedListName, setCopiedListName] = useState(null);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const onMenuItemClick = (name) => {
    const userFilter = name === "mug" ? mugUserFilter : allUserFilter;
    copyEmailsToClipboard(users || [], userFilter).then(() => {
      setCopiedListName(name);
    });
  };

  useEffect(() => {
    /**
     * Effect which closes the menu after a brief pause
     */
    if (!copiedListName) return;
    const timeout = setTimeout(() => {
      setCopiedListName(null);
      handleCloseMenu();
    }, 500);
    return () => clearTimeout(timeout);
  }, [copiedListName, handleCloseMenu]);

  const menuOpen = Boolean(anchorEl);

  return (
    <div>
      <Button
        id="copy-users-menu-button"
        aria-controls={menuOpen ? "copy-users-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={handleMenuClick}
        endIcon={<ArrowDropDownIcon />}
      >
        Contact users
      </Button>
      <Menu
        id="copy-users-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "copy-users-menu-button",
        }}
      >
        <MenuItem onClick={() => onMenuItemClick("mug")}>
          <ListItemIcon>
            {copiedListName === "mug" ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {copiedListName === "allUsers"
              ? "Copied!"
              : "Copy Moped User Group (MUG) email addresses"}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onMenuItemClick("allUsers")}>
          <ListItemIcon>
            {copiedListName === "allUsers" ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {copiedListName === "allUsers"
              ? "Copied!"
              : "Copy all active user email addresses"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
