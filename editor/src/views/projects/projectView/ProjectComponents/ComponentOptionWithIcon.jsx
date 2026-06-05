import { Box } from "@mui/material";

/**
 * Renders an option with icon based on the type of geometry (if it exists) and component type label
 * @param {Object} option - Autocomplete option object with label, value, and data about component type
 * @return {JSX.Element}
 */
export const ComponentOptionWithIcon = ({ option, props }) => {
  const { data: { line_representation = null } = {} } = option;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      }}
      {...props}
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
