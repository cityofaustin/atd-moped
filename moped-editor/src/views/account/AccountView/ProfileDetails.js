import React from "react";
import { useForm } from "react-hook-form";
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
  const [userApiResult, userApiLoading, requestApi] = useUserApi();

  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    formState,
    reset,
  } = useForm({});

  const { isSubmitting } = formState;

  const onSubmit = data => {
    // POST or PUT request to User Management API
    const requestString = "put";
    // const requestPath = "/users/" + userCognitoId + "/password";

    // requestApi({ method: requestString, path: requestPath, payload: data });
    console.log(userApiResult);
  };

  return (
    <Card>
      <CardHeader title="Update Your Password" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="first_name"
                id="first-name"
                label="First Name"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="last_name"
                id="last-name"
                label="Last Name"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="title"
                id="title"
                label="Title"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                inputRef={register}
                error={!!errors.title}
                helperText={errors.title?.message}
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
                    Save
                  </Button>
                  <Button
                    className={classes.formButton}
                    color="secondary"
                    variant="contained"
                    onClick={reset}
                  >
                    Reset
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
