import Switch from "@mui/material/Switch";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";

/**
 * A react-hook-form wrapper of the MUI Switch component
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @param {object} switchProps additional optional MUI switch props
 * @return {JSX.Element}
 */
const ControlledSwitch = ({ name, control, label, ...switchProps }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControlLabel
            label={label}
            control={
              <Switch
                checked={!!field.value}
                onChange={
                  switchProps.onChange
                    ? (e, _, field) => switchProps.onChange(e, field)
                    : (e) => field.onChange(e.target.checked)
                }
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                {...switchProps}
              />
            }
          />
        );
      }}
    />
  );
};

export default ControlledSwitch;
