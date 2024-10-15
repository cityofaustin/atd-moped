import { Box, Typography, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    // fieldGridItem: {
    //     margin: theme.spacing(2),
    //   },
    //   linkIcon: {
    //     fontSize: "1rem",
    //   },
    //   editIconFunding: {
    //     cursor: "pointer",
    //     margin: "0.5rem",
    //     fontSize: "1.5rem",
    //   },
    //   editIconContainer: {
    //     minWidth: "8rem",
    //     marginLeft: "8px",
    //   },
    //   editIconButton: {
    //     margin: "8px 0",
    //     padding: "8px",
    //   },
    //   editIconConfirm: {
    //     cursor: "pointer",
    //     margin: ".25rem 0",
    //     fontSize: "24px",
    //   },
      fieldLabel: {
        width: "100%",
        color: theme.palette.text.secondary,
        fontSize: ".8rem",
        margin: "8px 0",
      },
      fieldBox: {
        maxWidth: "10rem",
      },
      fieldLabelText: {
        width: "calc(100% - 2rem)",
        paddingLeft: theme.spacing(0.5),
      },
}));

const ProjectSubstantialCompletionDate = ({
  text,
  tooltipText,
}) => {
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
        <Tooltip placement="bottom-start" title={tooltipText || ""}>
          <Typography
            className={classes.fieldLabelText}
            component="span"
          >
            {/* If there is no input, render a "-" */}
            {text.length === 0 && <span>-</span>}
            {/* i dont think we need the span do we*/}
            <span>{text}</span>
          </Typography>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProjectSubstantialCompletionDate;
