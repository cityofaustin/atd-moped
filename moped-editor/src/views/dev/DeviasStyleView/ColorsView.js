import React from "react";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
    colorList: {
    width: "50%",
    position: "relative",
    paddingTop: "30px",
    margin: "0 auto",
    marginBottom: "75px",
    textAlign: "center",
    listStyle:"none",
  },
  colorCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display:" inline-block",
    marginRight: "20px",
  },
  colorHex: {
    position: "relative",
    color: "#D1D1D1",
    top: "120px",
    right: "6px"
  },
  color1: {
    background: theme.palette.background.dark,
  },
  color2: {
    backgroundColor: theme.palette.background.mapControlsHover,
  },
  color3: {
    backgroundColor: theme.palette.primary.main,
  },
  color4: {
    backgroundColor: theme.palette.secondary.main,
  }
}));

const TypographyView = () => {
  const classes = useStyles();

  return (
    <Paper>
      <ul className={classes.colorList}>
        <li className={`${classes.colorCircle}  ${classes.color1}`}>
          <div class="colorHex">#E1E2E1</div>
        </li>
        <li className={`${classes.colorCircle}  ${classes.color2}`}>
          <div class="colorHex">#BAE3C2</div>
        </li>
        <li className={`${classes.colorCircle}  ${classes.color3}`}>
          <div class="colorHex">#C7EDC2</div>
        </li>
        <li className={`${classes.colorCircle}  ${classes.color4}`}>
          <div class="colorHex">#E5EDC2</div>
        </li>
        <li className={classes.colorCircle}>
          <div class="colorHex">#E3E1BA</div>
        </li>
      </ul>
    </Paper>
  );
};

export default TypographyView;
