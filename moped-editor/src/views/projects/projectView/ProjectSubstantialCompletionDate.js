import { Box, Typography, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { formatDateType } from "src/utils/dateAndTime";

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

const completionDateTooltipText =
  "The earliest confirmed start date of a project phase that has a simple phase name of Complete (Complete or Post-construction)";

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
        <Tooltip placement="bottom-start" title={completionDateTooltipText}>
          <Typography className={classes.fieldLabelText} component="span">
            {/* If there is no input, render a "-" */}
            {(!completionDate || completionDate.length === 0) && <span>-</span>}
            {/* i dont think we need the span do we*/}
            <span>{formatDateType(completionDate)}</span>
          </Typography>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProjectSubstantialCompletionDate;
