# MOPED - Cognito Authentication

This folder contains one directory for the pre-token hook that generates
the JWT token for Hasura called `cognito-pre-token-hook`.

## Cognito Pre-Token Hook

To connect Hasura with AWS Cognito via JWT, we followed the guidelines
as provided by the Hasura team in this page:

https://hasura.io/docs/1.0/graphql/core/guides/integrations/aws-cognito.html

### How does a cognito trigger work?

There are several factors to be considered, among them:

- Set up user pools and hosted web UI. In here we create a pool of username
  and passwords. They also provide an option for a hosted UI to log in.

- Create a lambda function to add claims to the JWT. AWS provides a way
  to customize the behavior of the authentication process, here they create
  a "trigger hooks" which is basically a lambda function that executes whenever a token
  is being generated. This token contains "claims" which is just a json
  document that we can customize.

- Configure Cognito to trigger the lambda function. Here the pool is
  configured to use the trigger they create to customize the claims for
  Hasura's consumption.

- Test the Cognito login and generate sample JWTs for testing. Here they
  demonstrate how to get a JWT token from the hosted UI. This is not necessary
  for us, we can get the token from logging in to Moped.

- Configure Hasura to use Cognito keys. Here they demonstrate how to configure
  Hasura to retrieve the certificate for a user pool in order to decrypt the JWT
  claims it will receive.

- Add access control rules via the Hasura console. Here they demonstrate how to
  set up access control rules in Hasura.

- Sync users from Cognito. Here they demonstrate how to sync users from
  Cognito into Hasura using another trigger hook.

### Development

To test updates to this script, make changes in a local branch, and then push your
branch to GitHub. You can then go to the "Actions" tab of the repository and run
the "Build & Publish Cognito Hooks" workflow manually by choosing your development
branch. This will replace the existing code deployed as the staging pre-token hook
so you can verify the new code works as expected (staging users can log in, read, and
edit data in Moped).

If you are seeking to update the Lambda runtime version, update `LAMBDA_PYTHON_VERSION` in
the helper script (and `python-version` in the workflow file to match) instead of setting it
manually in the AWS Lambda console.
