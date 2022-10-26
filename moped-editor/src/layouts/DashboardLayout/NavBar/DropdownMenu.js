import React from "react";
import {
  Button,
  Divider,
  Link,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import MenuIcon from "@material-ui/icons/Menu";
import CDNAvatar from "../../../components/CDN/Avatar";
import { getSessionDatabaseData, useUser } from "../../../auth/user";
import { getInitials } from "src/utils/userNames";
import emailToInitials from "../../../utils/emailToInitials";
import clsx from "clsx";

export const helpItems = [
  {
    href: "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%7D",
    title: "Report a bug ",
  },
  {
    href: "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Feature%20or%20Enhancement%20%E2%80%94%20An%20application%20I%20use%20could%20be%20improved%22%2C%22field_399%22%3A%22Moped%22%7D",
    title: "Request an enhancement ",
  },
  {
    href: "https://teams.microsoft.com/l/channel/19%3ab1179ddfc92d44ea9abb23db713eb60c%40thread.tacv2/General?groupId=54a90854-d3fa-4053-9173-5352715bab37&tenantId=5c5e19f6-a6ab-4b45-b1d0-be4608a9a67f",
    title: "Ask a question ",
  },
  {
    href: "https://atd-dts.gitbook.io/moped/",
    title: "Moped user guide ",
  },
];

const useStyles = makeStyles((theme) => ({
  dropdownButton: {
    borderRadius: "50%",
    height: "64px",
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
  materialSymbol: {
    fontSize: "1.25rem",
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
        getContentAnchorEl={null}
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
        {helpItems.map((item) => (
          <MenuItem key={item.href} onClick={handleDropdownClose}>
            <ListItemIcon>
              <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="none"
            >
              {item.title}
            </Link>
          </MenuItem>
        ))}
        <MenuItem
          className={classes.helpItems}
          onClick={() => {
            handleDropdownClose();
            navigate("/moped/dev/lookups");
          }}
        >
          <ListItemIcon>
            {
              // todo clsx to make this more
            }
            <span
              className={clsx(
                classes.materialSymbol,
                "material-symbols-outlined"
              )}
            >
              menu_book
            </span>
          </ListItemIcon>
          Data Dictionary
        </MenuItem>
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
