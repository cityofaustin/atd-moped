import { Box, Typography, Tooltip } from "@mui/material";
import { formatDateType } from "src/utils/dateAndTime";
import { substantialCompletionDateTooltipText } from "src/constants/projects";

const ProjectSubstantialCompletionDate = ({ completionDate }) => {
  return (
    <>
      <Typography
        sx={{
          width: "100%",
          color: "text.secondary",
          fontSize: ".8rem",
        }}
      >
        Substantial completion date
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        sx={{ maxWidth: "10rem" }}
      >
        <Tooltip
          placement="bottom-start"
          title={substantialCompletionDateTooltipText}
        >
          <Typography
            sx={{
              width: "calc(100% - 2rem)",
            }}
            component="span"
          >
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
