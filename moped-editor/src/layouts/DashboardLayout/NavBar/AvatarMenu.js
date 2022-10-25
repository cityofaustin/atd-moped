import React from "react";
import {
  Button,
  Divider,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ExternalLink from "../../../components/ExternalLink";
import CDNAvatar from "../../../components/CDN/Avatar";
import { getSessionDatabaseData, useUser } from "../../../auth/user";
import { getInitials } from "src/utils/userNames";
import emailToInitials from "../../../utils/emailToInitials";

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
  avatar: {
    margin: 0,
  },
  avatarButton: {
    borderRadius: "50%",
    height: "64px",
  },
  helpHeader: {
    paddingLeft: "16px",
    paddingTop: "6px",
  },
  helpItems: {
    paddingLeft: "32px",
  },
}));

/**
 * Renders Support Menu on screens above Sm breakpoint
 * See https://material-ui.com/components/menus/ and https://material-ui.com/api/popover/
 * @return {JSX.Element}
 * @constructor
 */
const AvatarMenu = ({
  handleAvatarClick,
  handleAvatarClose,
  avatarAnchorEl,
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
      <Button className={classes.avatarButton} onClick={handleAvatarClick}>
        <CDNAvatar
          className={classes.avatar}
          src={userDbData?.picture}
          initials={userInitials}
          userColor={user?.userColor}
        />
      </Button>
      <Menu
        id="avatarDropdown"
        anchorEl={avatarAnchorEl}
        keepMounted
        open={Boolean(avatarAnchorEl)}
        onClose={handleAvatarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        getContentAnchorEl={null}
      >
        <MenuItem
          onClick={() => {
            handleAvatarClose();
            navigate("/moped/account");
          }}
        >
          Account
        </MenuItem>
        <Divider />
        <Typography className={classes.helpHeader}>Help</Typography>
        {helpItems.map((item) => (
          <MenuItem
            className={classes.helpItems}
            key={item.href}
            onClick={handleAvatarClose}
          >
            <ExternalLink
              url={item.href}
              text={item.title}
              linkColor="inherit"
              underline="none"
            />
          </MenuItem>
        ))}
        <MenuItem
          className={classes.helpItems}
          onClick={() => {
            handleAvatarClose();
            navigate("/moped/dev/lookups");
          }}
        >
          Lookups
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/moped/logout")}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
