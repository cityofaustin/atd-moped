import { Box, Typography, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { formatDateType } from "src/utils/dateAndTime";
import { substantialCompletionDateTooltipText } from "src/constants/projects";

const useStyles = makeStyles((theme) => ({
  fieldLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
  },
  fieldBox: {
    maxWidth: "10rem",
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
  },
}));

const ProjectSubstantialCompletionDate = ({ completionDate }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.fieldLabel}>
        Substantial completion date
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        <Tooltip
          placement="bottom-start"
          title={substantialCompletionDateTooltipText}
        >
          <Typography className={classes.fieldLabelText} component="span">
            {
              // If there is no input, render a "-"
              completionDate ? formatDateType(completionDate) : "-"
            }
          </Typography>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProjectSubstantialCompletionDate;
