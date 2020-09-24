import "babel-polyfill";
// import cssVars from "css-vars-ponyfill";

import Amplify from "aws-amplify";
import React from "react";
import ReactDOM from "react-dom";
import "./_index.scss";
import config from "./config";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";

// cssVars();

/**
 * AWS Amplify
 * @see https://github.com/aws-amplify/amplify-js
 */

Amplify.Logger.LOG_LEVEL = 'DEBUG';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "testApi",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            }
        ]
    }
});


ReactDOM.render(<App />, document.getElementById("root"));

// for IE-11 support un-comment cssVars() and it's import in this file
// and in MatxTheme file

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
