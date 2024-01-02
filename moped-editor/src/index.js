import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./auth/user";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

import Amplify, { Hub } from "aws-amplify";

import config from "./config";

// https://aws-amplify.github.io/docs/js/hub
Hub.listen(/.*/, ({ channel, payload }) =>
  console.debug(`[hub::${channel}::${payload.event}]`, payload)
);

// https://aws-amplify.github.io/docs/js/authentication#manual-setup
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: config.cognito.DOMAIN,
      scope: [
        "aws.cognito.signin.user.admin",
        "email",
        "openid",
        "phone",
        "profile",
      ],
      redirectSignIn: config.cognito.REDIRECT_SIGN_OUT,
      redirectSignOut: config.cognito.REDIRECT_SIGN_OUT,
      responseType: "code",
    },
    ...(["production", "staging", "test"].includes(config.env.APP_ENVIRONMENT)
      ? {
          cookieStorage: {
            expires: 30,
            domain: window.location.hostname,
            path: "/",
            secure: true,
          },
        }
      : {}),
  },
});

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
