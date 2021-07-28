import React from "react";
import { Avatar, Icon, makeStyles, Typography } from "@material-ui/core";
import { useUser } from "../../auth/user";

import config from "../../config";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    marginBottom: 8,
  },
  userInitials: {
    fontSize: "2rem",
  },
}));

const CDNAvatar = props => {
  const classes = useStyles();
  const { user } = useUser();

  const imageSrc = props?.src ? `${config.env.APP_CLOUDFRONT}/${props.src}` : null

  return (
    <Avatar
      className={props?.className ? props.className : classes.avatar}
      src={imageSrc}
      style={{ backgroundColor: imageSrc ? "white" : user?.userColor }}
    >
      <Typography className={props?.largeInitials ? classes.userInitials : null}>
        {props?.initials ? props.initials : <Icon>user</Icon>}
      </Typography>
    </Avatar>
  );
};

export default CDNAvatar;
