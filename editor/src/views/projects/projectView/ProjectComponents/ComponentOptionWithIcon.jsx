import { Box } from "@mui/material";
import ComponentIconByLineRepresentation from "src/views/projects/projectView/ProjectComponents/ComponentIconByLineRepresentation";

/**
 * Renders an option with icon based on the type of geometry (if it exists) and component type label
 * @param {Object} option - Autocomplete option object with label, value, and data about component type
 * @return {JSX.Element}
 */
const ComponentOptionWithIcon = ( { option, props }) => {
  const { data: { line_representation = null } = {} } = option;
  // Destructure the key from the props so it can be applied to the outer Box, and collect the rest of the props for the Box component
  const { key, ...boxProps } = props || {};
  return (
    <Box
      key={key}
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      }}
      {...boxProps}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: theme.spacing(1),
        })}
      >
        <ComponentIconByLineRepresentation
          lineRepresentation={line_representation}
          color={(theme) => theme.palette.primary.main}
        />
      </Box>
      {option.label}
    </Box>
  );
};

export default ComponentOptionWithIcon;
