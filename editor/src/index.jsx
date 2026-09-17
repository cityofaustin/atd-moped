import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "src/auth/AuthProvider";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { Hub, CookieStorage } from "aws-amplify/utils";

import config from "./config";
import UmamiAnalytics from "src/components/UmamiAnalytics";

// https://aws-amplify.github.io/docs/js/hub
Hub.listen(/.*/, ({ channel, payload }) =>
  console.debug(`[hub::${channel}::${payload.event}]`, payload)
);

// https://aws-amplify.github.io/docs/js/authentication#manual-setup
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: config.cognito.DOMAIN,
          scopes: [
            "aws.cognito.signin.user.admin",
            "email",
            "openid",
            "phone",
            "profile",
          ],
          redirectSignIn: [config.cognito.REDIRECT_SIGN_IN],
          redirectSignOut: [config.cognito.REDIRECT_SIGN_OUT],
          responseType: "code",
        },
      },
    },
  },
});

if (["production", "staging", "test"].includes(config.env.APP_ENVIRONMENT)) {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({
      domain: window.location.hostname,
      path: "/",
      expires: 30,
      secure: true,
      sameSite: "strict",
    })
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UmamiAnalytics />
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

serviceWorker.unregister();
