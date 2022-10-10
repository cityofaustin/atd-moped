import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  titleDisplayField: {
    display: "flex",
  },
}));

const ProjectName = ({ name, id }) => {
  const classes = useStyles();

  return (
    <span className={classes.titleDisplayField}>
      <Typography color="textPrimary" variant="h1">
        {name}
      </Typography>
      <Typography color="textSecondary" variant="h1">
        &nbsp;#{id}
      </Typography>
    </span>
  );
};

export default ProjectName;
