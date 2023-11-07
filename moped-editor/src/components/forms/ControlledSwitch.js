import Switch from "@mui/material/Switch";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";

const ControlledSwitch = ({ name, control, label }) => {
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
                onChange={(e) => field.onChange(e.target.checked)}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
          />
        );
      }}
    />
  );
};

export default ControlledSwitch;
