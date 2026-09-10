import {
  Box,
  Tooltip,
  Typography,
  type BoxProps,
  type TypographyProps,
} from "@mui/material";
import { fieldLabelText } from "src/styles/reusableStyles";

interface ProjectSummaryLabelProps {
  /** label text */
  text: string;
  /**  The function to call on edit click */
  onClickEdit: () => void;
  /** sx object determined by parent component */
  sxProp?: TypographyProps["sx"];
  /** sx object for span element determined by parent component */
  spanSxProp?: BoxProps["sx"];
  /** */
  tooltipText?: string;
}
/**
 *

 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryLabel = ({
  text,
  onClickEdit,
  sxProp,
  spanSxProp,
  tooltipText,
}: ProjectSummaryLabelProps) => {
  return (
    // the tooltip will not appear if the `title` is empty
    <Tooltip placement="bottom-start" title={tooltipText || ""}>
      <Typography
        sx={sxProp ?? fieldLabelText}
        onClick={onClickEdit}
        component="span"
      >
        {/* If there is no input, render a "-" */}
        {text.length === 0 && <Box>-</Box>}
        {/* If the input is an array, render one item per line */}
        {Array.isArray(text) &&
          text.map((element, i) => (
            <Box key={i} sx={spanSxProp}>
              {element} <br />
            </Box>
          ))}
        {/* Otherwise, render the input on one line */}
        {!Array.isArray(text) && <Box sx={spanSxProp}>{text}</Box>}
      </Typography>
    </Tooltip>
  );
};

export default ProjectSummaryLabel;
