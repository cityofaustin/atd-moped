import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  titleDisplayField: {
    display: "flex",
  },
  titleText: {
    // textOverflow: "ellipsis",
    textWrap: "nowrap",
    maxWidth: "800px", // this needs to match the width of teh screen dynamically
    overflow: "scroll",
  },
  titleId: {
    alignSelf: "center",
  },
}));

const ProjectName = ({ name, id }) => {
  const classes = useStyles();

  return (
    <span className={classes.titleDisplayField}>
      <Typography
        color="textPrimary"
        variant="h1"
        className={classes.titleText}
      >
        {name}
      </Typography>
      <Typography
        color="textSecondary"
        variant="h1"
        className={classes.titleId}
      >
        &nbsp;#{id}
      </Typography>
    </span>
  );
};

export default ProjectName;
