export default {
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://tm4r2xqz3c.execute-api.us-east-1.amazonaws.com/dev/hello"
    },
    cognito: {
        REGION: process.env.REACT_APP_AWS_COGNITO_REGION,
        USER_POOL_ID: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
        APP_CLIENT_ID: process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID,
    }
};

