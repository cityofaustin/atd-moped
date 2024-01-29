import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

/**
 * A react-hook-form wrapper of the MUI Switch component
 * @param {Function} register - react-hook-form `register` function from useForm - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @param {object} switchProps additional optional MUI switch props
 * @return {JSX.Element}
 */
const RegisteredSwitch = ({
  name,
  register,
  label,
  onChange,
  ...switchProps
}) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <Switch
          {...register(name, {
            ...(onChange && { onChange }),
          })}
          color="primary"
          inputProps={{ "aria-label": "primary checkbox" }}
          {...switchProps}
        />
      }
    />
  );
};

export default RegisteredSwitch;
