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
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CDNAvatar from "src/components/CDN/Avatar";
import { getSessionDatabaseData, useUser } from "src/auth/user";
import { getInitials } from "src/utils/userNames";
import emailToInitials from "src/utils/emailToInitials";

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
    Icon: <MailOutlineIcon fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://atd-dts.gitbook.io/moped-documentation/user-guides/getting-started",
    title: "User guides ",
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

export const arcGISLink = {
  linkType: "external",
  link: "https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=404d31d56b57491abe53ccfd718fcaee",
  title: "Moped map",
  Icon: <MapOutlinedIcon fontSize="small" />,
};

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
  const navigate = useNavigate();

  const { user } = useUser();

  const userDbData = getSessionDatabaseData();
  const userInitials = userDbData
    ? getInitials(userDbData)
    : emailToInitials(user?.idToken?.payload?.email);

  return (
    <>
      <Button
        sx={{
          borderRadius: "50%",
          height: "64px",
          color: "text.primary",
        }}
        onClick={handleDropdownClick}
      >
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
              size="small"
              src={userDbData?.picture}
              initials={userInitials}
              userColor={user?.userColor}
            />
          </ListItemIcon>
          Account
        </MenuItem>
        <Divider sx={{ marginY: 1 }} />
        <Link
          href={arcGISLink.link}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="none"
        >
          <MenuItem onClick={handleDropdownClose}>
            <ListItemIcon>{arcGISLink.Icon}</ListItemIcon>
            {arcGISLink.title}
          </MenuItem>
        </Link>
        <Divider sx={{ marginY: 1 }} />
        <Typography
          variant="button"
          color="textSecondary"
          sx={{
            paddingLeft: 2,
            paddingTop: 1,
            alignItems: "center",
            display: "flex",
            position: "relative",
          }}
        >
          Support
        </Typography>
        {helpItems.map((item) => {
          if (item.linkType === "external") {
            return (
              <Link
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="none"
              >
                <MenuItem onClick={handleDropdownClose}>
                  <ListItemIcon>
                    {item.Icon || <OpenInNewIcon fontSize="small" />}
                  </ListItemIcon>
                  {item.title}
                </MenuItem>
              </Link>
            );
          }
          if (item.linkType === "internal") {
            return (
              <MenuItem
                key={item.link}
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
        <Divider sx={{ marginY: 1 }} />
        <MenuItem onClick={() => navigate("/moped/logout")}>
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
