import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller } from "react-hook-form";

/**
 * A react-hook-form wrapper of the MUI Switch component
 * @param {Function} register - react-hook-form `register` function from useForm - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @param {Function} onChange - an optional custom onChange handler
 * @param {object} switchProps additional optional MUI switch props
 * @return {JSX.Element}
 */
const RegisteredSwitch = ({
  name,
  // register,
  control,
  label,
  customOnChange,
  ...switchProps
}) => {
  // const { value, ...registerProps } = register(name, {
  //   ...(onChange && { onChange }),
  // });

  return (
    // <FormControlLabel
    //   label={label}
    //   control={
    // <Switch
    //   {...registerProps}
    //   checked={value}
    //   color="primary"
    //   inputProps={{ "aria-label": "primary checkbox" }}
    //   {...switchProps}
    // />
    // />
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

export default RegisteredSwitch;
