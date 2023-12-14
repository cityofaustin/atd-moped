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
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
    title: "Contact support",
    Icon: <LocalPhoneIcon fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://atd-dts.gitbook.io/moped/",
    title: "User guide ",
    Icon: <HelpOutlineOutlinedIcon fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://teams.microsoft.com/l/channel/19%3ab1179ddfc92d44ea9abb23db713eb60c%40thread.tacv2/General?groupId=54a90854-d3fa-4053-9173-5352715bab37&tenantId=5c5e19f6-a6ab-4b45-b1d0-be4608a9a67f",
    title: "Microsoft Teams",
    Icon: <ChatOutlinedIcon fontSize="small" />,
  },
  {
    linkType: "internal",
    link: "/moped/dev/lookups",
    title: "Data dictionary",
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
        <MenuItem onClick={handleDropdownClose}>
          <ListItemIcon>
            <MapOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=404d31d56b57491abe53ccfd718fcaee"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="none"
          >
            ArcGIS Online Map
          </Link>
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
