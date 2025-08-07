import React from "react";
import { Avatar, Icon, Typography } from "@mui/material";

import config from "src/config";

const defaultAvatarStyle = {
  small: (theme) => ({ height: theme.spacing(4), width: theme.spacing(4) }),
  large: { height: 100, width: 100, marginBottom: 1 },
};

/**
 * A wrapper for Material's Avatar component.
 * @param {string} size - The size of the avatar (small, large).
 * @param {String} src - The image in the CDN
 * @param {String} initials - The initials to render within the avatar (when no image is present).
 * @param {boolean} largeInitials - If true, it makes the initials a little larger.
 * @param {String} userColor - The background color to render under the initials.
 * @param {boolean} useGenericAvatar - If true, whenever src is not provided it uses a generic avatar as opposed to initials.
 * @return {JSX.Element}
 * @constructor
 */
const CDNAvatar = ({
  size = "large",
  src,
  initials,
  largeInitials,
  userColor,
  useGenericAvatar,
}) => {
  /**
   * The image source from CloudFront CDN
   * @type {string|null}
   */
  const imageSource = !!src ? `${config.env.APP_CLOUDFRONT}/${src}` : null;

  /**
   * Overrides the default background color if provided.
   * @type {{backgroundColor: (string)}|null}
   */
  const imageStyleOverride = !!userColor
    ? {
        backgroundColor: userColor,
      }
    : null;

  return (
    <Avatar
      alt={initials}
      sx={defaultAvatarStyle[size]}
      src={imageSource}
      style={imageStyleOverride}
    >
      {!!!useGenericAvatar && initials && initials.length > 0 ? (
        <Typography sx={largeInitials ? { fontSize: "2rem" } : null}>
          {initials}
        </Typography>
      ) : (
        <Icon>person</Icon>
      )}
    </Avatar>
  );
};

export default CDNAvatar;
