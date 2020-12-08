import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./auth/user";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import Amplify from "aws-amplify";

import { Hub } from "aws-amplify";
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
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: "atd-moped-staging.auth.us-east-1.amazoncognito.com",
      scope: [
        "aws.cognito.signin.user.admin",
        "email",
        "openid",
        "phone",
        "profile",
      ],
      redirectSignIn: "https://localhost:3000/moped/session/signin",
      redirectSignOut: "https://localhost:3000/moped/session/signin",
      responseType: "code",
    },
  },
  API: {
    endpoints: [
      {
        name: "testApi",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.render(
  <BrowserRouter basename={"/moped"}>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
