import React from "react";
import clsx from "clsx";
import { Paper, makeStyles, Box, Avatar } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  colorCircles: {
    width: "60px",
    height: "60px",
    marginRight: "10px",
  },
  color1: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  color2: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  color3: {
    backgroundColor: theme.palette.background.dark,
    color: theme.palette.background.dark,
  },
  color4: {
    backgroundColor: theme.palette.background.mapControlsHover,
    color: theme.palette.background.mapControlsHover,
  },
}));

const TypographyView = () => {
  const classes = useStyles();

  return (
    <Paper>
      <Box p={3}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={clsx(classes.colorCircles, classes.color1)}>
                1
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Primary Color" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={clsx(classes.colorCircles, classes.color2)}>
                2
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Secondary Color" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={clsx(classes.colorCircles, classes.color3)}>
                3
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Background Color" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={clsx(classes.colorCircles, classes.color4)}>
                4
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Map Control Hover Color" />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default TypographyView;
