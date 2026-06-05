import { Icon } from "@mui/material";
import {
  RoomOutlined as RoomOutlinedIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

export const ComponentIconByLineRepresentation = ({
  lineRepresentation,
  color,
}) => {
  if (lineRepresentation === true)
    return (
      <TimelineIcon
        sx={{
          color: color,
        }}
      />
    );
  if (lineRepresentation === false)
    return (
      <RoomOutlinedIcon
        sx={{
          color: color,
        }}
      />
    );
  /* Fall back to a blank icon to keep labels lined up */
  if (lineRepresentation === null)
    return (
      <Icon
        sx={{
          color: color,
        }}
      />
    );
};
