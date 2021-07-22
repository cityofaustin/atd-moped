import React, { useState } from "react";
import { IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import ExternalLink from "../../../components/ExternalLink";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

const useStyles = makeStyles(theme => ({
  iconButton: {
    // marginTop: "6px",
  },
}));

export const helpItems = [
  {
    href:
      "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%7D",
    title: "Report a bug ",
  },
  {
    href:
      "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Feature%20or%20Enhancement%20%E2%80%94%20An%20application%20I%20use%20could%20be%20improved%22%2C%22field_399%22%3A%22Moped%22%7D",
    title: "Request an enhancement ",
  },
  {
    href:
      "https://teams.microsoft.com/l/channel/19%3ab1179ddfc92d44ea9abb23db713eb60c%40thread.tacv2/General?groupId=54a90854-d3fa-4053-9173-5352715bab37&tenantId=5c5e19f6-a6ab-4b45-b1d0-be4608a9a67f",
    title: "Ask a question ",
  },
  {
    href: "https://atd-dts.gitbook.io/moped/",
    title: "Moped user guide ",
  },
];

const SupportMenu = ({ className, onOpen, ...rest }) => {
  const classes = useStyles();
  const [supportAnchorEl, setSupportAnchorEl] = useState(null);

  const handleSupportClick = event => {
    setSupportAnchorEl(event.currentTarget);
  };

  const handleSupportClose = () => {
    setSupportAnchorEl(null);
  };

  return (
    <>
      <IconButton className={classes.iconButton} onClick={handleSupportClick}>
        <HelpOutlineIcon />
      </IconButton>
      <Menu
        id="mobileDropdown"
        anchorEl={supportAnchorEl}
        keepMounted
        open={Boolean(supportAnchorEl)}
        onClose={handleSupportClose}
        anchorOrigin={{ vertical: 56, horizontal: "right" }}
        getContentAnchorEl={null}
      >
        {helpItems.map(item => (
          <MenuItem onClick={handleSupportClose}>
            <ExternalLink
              url={item.href}
              text={item.title}
              linkColor="inherit"
              underline="none"
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SupportMenu;
