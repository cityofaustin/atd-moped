import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller } from "react-hook-form";

/**
 * A react-hook-form wrapper of the MUI Switch component
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @param {Function} customOnChange - an optional custom onChange handler
 * @param {object} switchProps additional optional MUI switch props
 * @return {JSX.Element}
 */
const ControlledSwitch = ({
  control,
  name,
  label,
  customOnChange,
  ...switchProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={customOnChange ? customOnChange : onChange}
              {...switchProps}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default ControlledSwitch;
