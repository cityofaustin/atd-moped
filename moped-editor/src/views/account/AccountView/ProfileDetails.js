import React from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../../auth/user";
import { useUserApi } from "../../staff/helpers";
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

const useStyles = makeStyles(() => ({
  root: {},
}));

const ProfileDetails = () => {
  const classes = useStyles();
  const { user } = useUser();
  const [userApiResult, userApiLoading, requestApi] = useUserApi();

  const { register, handleSubmit, errors, formState } = useForm({});

  const { isSubmitting } = formState;

  const onSubmit = data => {
    // POST or PUT request to User Management API
    const requestString = "put";

    const userCognitoId = user.username;
    const requestPath = "/users/" + userCognitoId + "/password";

    requestApi({ method: requestString, path: requestPath, payload: data });
  };

  console.log(userApiResult);

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
                label="New Password"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="passwordReenter"
                id="password-reenter"
                label="Re-enter new password"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid> */}
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
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
