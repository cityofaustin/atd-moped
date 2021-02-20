export default {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://tm4r2xqz3c.execute-api.us-east-1.amazonaws.com/dev/hello",
  },
  application: {
    ENVIRONMENT: process.env.REACT_APP_HASURA_ENV,
  },
  cognito: {
    APP_CLIENT_ID: process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID,
    DOMAIN: process.env.REACT_APP_AWS_COGNITO_DOMAIN,
    REDIRECT_SIGN_IN: process.env.REACT_APP_AWS_COGNITO_REDIRECT_SIGN_IN,
    REDIRECT_SIGN_OUT: process.env.REACT_APP_AWS_COGNITO_REDIRECT_SIGN_OUT,
    REGION: process.env.REACT_APP_AWS_COGNITO_REGION,
    USER_POOL_ID: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  },
  cloudfront: {
    DOMAIN: process.env.REACT_APP_AWS_CLOUDFRONT_DOMAIN,
    SECURE: process.env.REACT_APP_AWS_CLOUDFRONT_SECURE,
    EXPIRATION: process.env.REACT_APP_AWS_CLOUDFRONT_EXPIRATION,
  }
};
