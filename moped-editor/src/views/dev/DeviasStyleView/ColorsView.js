import React from "react";
import { Paper, makeStyles, Box, Avatar } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  color3: {
    background: theme.palette.background.dark,
    width: "60px",
    height: "60px",
  },
  color4: {
    backgroundColor: theme.palette.background.mapControlsHover,
    width: "60px",
    height: "60px",
  },
  color1: {
    backgroundColor: theme.palette.primary.main,
    width: "60px",
    height: "60px",
    color: theme.palette.primary.main,
  },
  color2: {
    backgroundColor: theme.palette.secondary.main,
    width: "60px",
    height: "60px",
    color: theme.palette.secondary.main,
  },
}));


const TypographyView = () => {
  const classes = useStyles();

  return (
    <Paper>
      <Box p={3}>
      <List>
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.color1}>1</Avatar>
          </ListItemIcon>
          <ListItemText primary="Primary Color" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.color2}>2</Avatar>
          </ListItemIcon>
          <ListItemText primary="Secondary Color" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.color3}>3</Avatar>
          </ListItemIcon>
          <ListItemText primary="Background Color" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.color4}>4</Avatar>
          </ListItemIcon>
          <ListItemText primary="Map Control Hover Color" />
        </ListItem>
      </List>
      </Box>
    </Paper>
  );
};

export default TypographyView;
