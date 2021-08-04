import React from "react";
import { Avatar, Icon, makeStyles, Typography } from "@material-ui/core";

import config from "../../config";

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    marginBottom: 8,
    backgroundColor: theme.palette.grey["300"],
  },
  userInitials: {
    fontSize: "2rem",
  },
}));


/**
 * A wrapper for Material's Avatar component.
 * @param {Object} className - The class name override
 * @param {String} src - The image in the CDN
 * @param {String} initials - The initials to render within the avatar (when no image is present).
 * @param {boolean} largeInitials - If true, it makes the initials a little larger.
 * @param {String} userColor - The background color to render under the initials.
 * @return {JSX.Element}
 * @constructor
 */
const CDNAvatar = ({className, src, initials, largeInitials, userColor}) => {
  const classes = useStyles();

  /**
   * The image source from CloudFront CDN
   * @type {string|null}
   */
  const imageSource = src
    ? `${config.env.APP_CLOUDFRONT}/${src}`
    : null; // If src is null, the avatar will default to initials

  /**
   * Overrides the default background color if provided.
   * @type {{backgroundColor: (string)}|null}
   */
  const imageStyleOverride = userColor
    ? {
        backgroundColor: userColor,
      }
    : null;

  return (
    <Avatar
      className={className ? className : classes.avatar}
      src={imageSource}
      style={imageStyleOverride}
    >
      <Typography
        className={largeInitials ? classes.userInitials : null}
      >
        {initials ? initials : <Icon>user</Icon>}
      </Typography>
    </Avatar>
  );
};

export default CDNAvatar;
