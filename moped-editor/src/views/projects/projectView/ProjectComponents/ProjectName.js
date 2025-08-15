import { Typography, Box } from "@mui/material";

const ProjectName = ({ name, id }) => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Typography
        color="textPrimary"
        variant="h2"
        sx={{
          textOverflow: "ellipsis",
          textWrap: "nowrap",
          maxWidth: "calc(100vw - 450px)", // visible width minus space for project id, status and close map
          overflow: "hidden",
        }}
        title={name}
      >
        {name}
      </Typography>
      <Typography
        color="textSecondary"
        variant="h2"
        sx={{
          alignSelf: "center",
        }}
      >
        &nbsp;#{id}
      </Typography>
    </Box>
  );
};

export default ProjectName;
