import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {},
}));

const ProfileDetails = ({ className }) => {
  const classes = useStyles();

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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
                  {!editFormData && (
                    <Button
                      className={classes.formButton}
                      color="secondary"
                      variant="contained"
                      onClick={() => reset(initialFormValues)}
                    >
                      Reset
                    </Button>
                  )}
                  {editFormData && (
                    <Button
                      className={classes.formDeleteButton}
                      color="secondary"
                      variant="contained"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete User
                    </Button>
                  )}
                </>
              )}
              <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Delete this user?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure that you want to delete this user?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setIsDeleteModalOpen(false)}
                    color="primary"
                    autoFocus
                  >
                    No
                  </Button>
                  {userApiLoading ? (
                    <CircularProgress />
                  ) : (
                    <Button onClick={handleDeleteConfirm} color="primary">
                      Yes
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
          <DevTool control={control} />
        </form>
      </CardContent>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
};

export default ProfileDetails;
