import React from "react";
import {
  Button,
  Divider,
  Link,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import CDNAvatar from "../../../components/CDN/Avatar";
import { getSessionDatabaseData, useUser } from "../../../auth/user";
import { getInitials } from "src/utils/userNames";
import emailToInitials from "../../../utils/emailToInitials";

/**
 * Configuration for help menu items we iterate to render menu items in DropdownMenu and MobileDropdownMenu
 * @property {string} linkType - "internal" or "external" to determine how to render link
 * @property {string} link - external href or internal route
 * @property {string} title - Text to display for menu item
 * @property {JSX.Element} Icon - Icon to display for menu item in place of the default OpenInNewIcon
 */
export const helpItems = [
  {
    linkType: "external",
    link: "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_399%22%3A%22Moped%22%7D",
    title: "Ask for help",
  },
  {
    linkType: "external",
    link: "https://atd-dts.gitbook.io/moped/",
    title: "Moped user guide ",
  },
  {
    linkType: "internal",
    link: "/moped/dev/lookups",
    title: "Data Dictionary",
    Icon: <MenuBookOutlined fontSize="small" />,
  },
];

const useStyles = makeStyles((theme) => ({
  dropdownButton: {
    borderRadius: "50%",
    height: "64px",
    color: theme.palette.text.primary,
  },
  helpHeader: {
    paddingLeft: "16px",
    paddingTop: "6px",
    alignItems: "center",
    display: "flex",
    position: "relative",
  },
  dropdownAvatar: {
    height: "30px",
    width: "30px",
  },
  logoutItem: {
    paddingTop: "10px",
  },
  helpItems: {
    paddingBottom: "12px",
  },
}));

/**
 * Renders Dropdown Menu on screens above Sm breakpoint
 * See https://material-ui.com/components/menus/ and https://material-ui.com/api/popover/
 * @return {JSX.Element}
 * @constructor
 */
const DropdownMenu = ({
  handleDropdownClick,
  handleDropdownClose,
  dropdownAnchorEl,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { user } = useUser();

  const userDbData = getSessionDatabaseData();
  const userInitials = userDbData
    ? getInitials(userDbData)
    : emailToInitials(user?.idToken?.payload?.email);

  return (
    <>
      <Button className={classes.dropdownButton} onClick={handleDropdownClick}>
        <MenuIcon />
      </Button>
      <Menu
        id="menuDropdown"
        anchorEl={dropdownAnchorEl}
        keepMounted
        open={Boolean(dropdownAnchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleDropdownClose();
            navigate("/moped/account");
          }}
        >
          <ListItemIcon>
            <CDNAvatar
              className={classes.dropdownAvatar}
              src={userDbData?.picture}
              initials={userInitials}
              userColor={user?.userColor}
            />
          </ListItemIcon>
          Account
        </MenuItem>
        <Divider />
        <span className={classes.helpHeader}>
          <Typography variant="button" color="textSecondary">
            Support
          </Typography>
        </span>
        {helpItems.map((item) => {
          if (item.linkType === "external") {
            return (
              <MenuItem key={item.link} onClick={handleDropdownClose}>
                <ListItemIcon>
                  {item.Icon || <OpenInNewIcon fontSize="small" />}
                </ListItemIcon>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="none"
                >
                  {item.title}
                </Link>
              </MenuItem>
            );
          }
          if (item.linkType === "internal") {
            return (
              <MenuItem
                key={item.link}
                className={classes.helpItems}
                onClick={() => {
                  handleDropdownClose();
                  navigate(item.link);
                }}
              >
                <ListItemIcon>
                  {item.Icon || <OpenInNewIcon fontSize="small" />}
                </ListItemIcon>
                {item.title}
              </MenuItem>
            );
          }
          return null;
        })}
        <Divider />
        <MenuItem
          className={classes.logoutItem}
          onClick={() => navigate("/moped/logout")}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default DropdownMenu;
