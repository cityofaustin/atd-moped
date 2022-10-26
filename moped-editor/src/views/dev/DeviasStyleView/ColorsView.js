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
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
  color3: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.light,
  },
  color4: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  color5: {
    backgroundColor: theme.palette.background.dark,
    color: theme.palette.background.dark,
  },
  color6: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.background.default,
  },
  color7: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.background.paper,
  },
  color8: {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
  color9: {
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.text.secondary,
  },
  color10: {
    backgroundColor: theme.palette.background.mapControlsHover,
    color: theme.palette.background.mapControlsHover,
  },
  avatar: {
    boxShadow: theme.shadows[3],
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
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color1,
                  classes.avatar
                )}
              >
                1
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Primary Main" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color2,
                  classes.avatar
                )}
              >
                2
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Primary Dark" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color3,
                  classes.avatar
                )}
              >
                3
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Primary Light" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color4,
                  classes.avatar
                )}
              >
                4
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Secondary Main" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color5,
                  classes.avatar
                )}
              >
                {" "}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Background Dark" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color6,
                  classes.avatar
                )}
              >
                6
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Background Default" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color7,
                  classes.avatar
                )}
              >
                7
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Background Paper" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color8,
                  classes.avatar
                )}
              >
                8
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Text Primary" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color9,
                  classes.avatar
                )}
              >
                9
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Text Secondary" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                className={clsx(
                  classes.colorCircles,
                  classes.color10,
                  classes.avatar
                )}
              >
                10
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
