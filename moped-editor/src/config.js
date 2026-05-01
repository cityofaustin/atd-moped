const config = {
  env: {
    APP_ENVIRONMENT: import.meta.env.VITE_APP_ENV,
    APP_HASURA_ENDPOINT: import.meta.env.VITE_HASURA_ENDPOINT,
    APP_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
  },
  cognito: {
    APP_CLIENT_ID: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
    DOMAIN: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
    REDIRECT_SIGN_IN: import.meta.env.VITE_AWS_COGNITO_REDIRECT_SIGN_IN,
    REDIRECT_SIGN_OUT: import.meta.env.VITE_AWS_COGNITO_REDIRECT_SIGN_OUT,
    REGION: import.meta.env.VITE_AWS_COGNITO_REGION,
    USER_POOL_ID: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
  },
};

export default config;
