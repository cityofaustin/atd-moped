import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  titleDisplayField: {
    display: "flex",
  },
  titleText: {
    // textOverflow: "ellipsis",
    textWrap: "nowrap",
    maxWidth: "calc(100vw - 450px)", // visible width minus space for project id, status and close map
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
