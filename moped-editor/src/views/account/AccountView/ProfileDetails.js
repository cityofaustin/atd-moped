import React from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../../auth/user";
import { useUserApi } from "../../staff/helpers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formButton: {
    margin: theme.spacing(1),
  },
}));

const initialValues = {
  password: "",
  passwordConfirm: "",
};

const passwordValidationSchema = yup.object().shape({
  password: yup.string().required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match"),
});

const ProfileDetails = () => {
  const classes = useStyles();
  const { user } = useUser();
  const [userApiResult, userApiLoading, requestApi] = useUserApi();

  const { register, handleSubmit, errors, formState, control } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(passwordValidationSchema),
  });

  const { isSubmitting } = formState;

  const onSubmit = data => {
    // POST or PUT request to User Management API
    const requestString = "put";

    const userCognitoId = user.username;
    const requestPath = "/users/" + userCognitoId + "/password";

    // requestApi({ method: requestString, path: requestPath, payload: data });
    console.log(data);
  };

  return (
    <Card>
      <CardHeader title="Change Your Password" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="password"
                id="password"
                label="New password"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="passwordConfirm"
                id="password-confirm"
                label="Confirm new password"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {userApiLoading || isSubmitting ? (
                <CircularProgress />
              ) : (
                <>
                  <Button
                    className={classes.formButton}
                    disabled={isSubmitting}
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    Change Password
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
          <DevTool control={control} />
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
