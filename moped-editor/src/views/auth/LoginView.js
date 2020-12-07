import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Page from "src/components/Page";
import { useUser } from "../../auth/user";
import { Auth, Hub } from "aws-amplify";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoginView = () => {
  const classes = useStyles();

  const { login, getTokenbyCode, user } = useUser();

  let query = useQuery();
  useEffect(() => {
    let cognitoCallbackCode = query.get("code");

    Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log(event);
      console.log(data);
    });

    console.log(cognitoCallbackCode);
    getTokenbyCode(cognitoCallbackCode);
  }, []);

  // Auth.federatedSignIn(cognitoCallbackCode).then(cognitoUser => {
  //   return cognitoUser;
  // });

  // a handler for when the user clicks the "login" button
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // wait to see if login was successful (we don't care about the return
      // value here)
      await login(values.email, values.password);

      // mark the form as non-subbmitting
      setSubmitting(false);
    } catch (err) {
      // If an error occured, showcase the proper message (we customised the
      // message ourselves in `UserProvider`'s code)
      setErrors({ password: err.message });
      setSubmitting(false);
    }
  };

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string()
                .max(255)
                .required("Password is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on with Microsoft Office 365
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<AccountCircleIcon />}
                      // PRODUCTION
                      // domain: atd-moped-production
                      // redirect_uri: TK
                      // client_id= ins01e2a8d3vd8apvnd0jv10c

                      // STAGING
                      // domain: atd-moped-staging
                      // redirect_uri: TK
                      // client_id= 3u9n9373e37v603tbp25gs5fdc

                      // LOCAL
                      // domain: atd-moped-staging
                      // redirect_uri: http://localhost:3000/moped/session/signin
                      // client_id= 3u9n9373e37v603tbp25gs5fdc

                      href="https://atd-moped-staging.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=AzureAD&redirect_uri=https://localhost:3000/moped/session/signin&response_type=code&client_id=3u9n9373e37v603tbp25gs5fdc&scope=aws.cognito.signin.user.admin email openid phone profile"
                      size="large"
                      variant="contained"
                    >
                      Login with COA account
                    </Button>
                  </Grid>
                </Grid>
                <Box mt={3} mb={1}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{" "}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
