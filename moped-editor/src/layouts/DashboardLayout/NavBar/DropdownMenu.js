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
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CDNAvatar from "../../../components/CDN/Avatar";
import { useSessionDatabaseData, useUser } from "src/auth/user";
import { getInitials } from "src/utils/userNames";
import emailToInitials from "src/utils/emailToInitials";
import { helpItems, analysisItems } from "./menuConfig";

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

  const userDbData = useSessionDatabaseData();
  const userInitials = userDbData
    ? getInitials(userDbData)
    : emailToInitials(userDbData?.email);

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
        {analysisItems.map((item) => (
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
        ))}
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
