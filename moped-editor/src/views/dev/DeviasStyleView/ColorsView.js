import React from "react";
import { Paper, Box, Avatar } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

const avatarBaseSx = {
  width: "3.75rem",
  height: "3.75rem",
  marginRight: "0.625rem",
  boxShadow: (theme) => theme.shadows[3],
  color: "transparent",
};

// Configuration array for all color swatches
const colorConfig = [
  {
    number: 1,
    backgroundColor: "primary.main",
    label: "Primary Main",
  },
  {
    number: 2,
    backgroundColor: "primary.dark",
    label: "Primary Dark",
  },
  {
    number: 3,
    backgroundColor: "primary.light",
    label: "Primary Light",
  },
  {
    number: 4,
    backgroundColor: "secondary.main",
    label: "Secondary Main",
  },
  {
    number: 5,
    backgroundColor: "background.dark",
    label: "Background Dark",
  },
  {
    number: 6,
    backgroundColor: "background.default",
    label: "Background Default",
  },
  {
    number: 7,
    backgroundColor: "background.paper",
    label: "Background Paper",
  },
  {
    number: 8,
    backgroundColor: "text.primary",
    label: "Text Primary",
  },
  {
    number: 9,
    backgroundColor: "text.secondary",
    label: "Text Secondary",
  },
  {
    number: 10,
    backgroundColor: "background.mapControlsHover",
    label: "Map Controls Hover",
  },
];

const TypographyView = () => {
  return (
    <Paper>
      <Box p={3}>
        <List>
          {colorConfig.map((color) => (
            <ListItem key={color.number}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    ...avatarBaseSx,
                    backgroundColor: color.backgroundColor,
                  }}
                >
                  {color.number}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={color.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TypographyView;
