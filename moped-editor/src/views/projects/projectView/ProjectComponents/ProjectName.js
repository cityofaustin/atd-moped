import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  titleDisplayField: {
    display: "flex",
  },
  titleId: {
    alignSelf: "center",
  },
}));

const ProjectName = ({ name, id }) => {
  const classes = useStyles();

  return (
    <span className={classes.titleDisplayField}>
      <Typography color="textPrimary" variant="h1">
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
