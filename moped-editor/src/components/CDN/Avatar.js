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

  const fileName = props?.src ?? null;
  const src = `${config.env.APP_CLOUDFRONT}/${fileName ?? "na.png"}`;

  return (
    <Avatar
      className={props?.className ? props.className : classes.avatar}
      src={fileName ? src : null}
      style={{ backgroundColor: fileName ? "white" : user?.userColor }}
    >
      <Typography className={props?.largeInitials ? classes.userInitials : null}>
        {props?.initials ? props.initials : <Icon>user</Icon>}
      </Typography>
    </Avatar>
  );
};

export default CDNAvatar;
