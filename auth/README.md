# MOPED - Cognito Authentication

This folder contains one directory for the pre-token hook that generates
the JWT token for Hasura called `cognito-pre-token-hook`.

## Cognito Pre-Token Hook

To connect Hasura with AWS Cognito via JWT, we followed the guidelines
as provided by the Hasura team in this page:

https://hasura.io/learn/graphql/hasura-authentication/integrations/cognito/

### How does this Cognito trigger work?

Cognito runs this Lambda as a pre-token generation trigger every time it issues a token.
The Lambda adds Hasura claims to the JWT so Hasura knows who the user is and what they can access:

1. Gets the user's email from the event. For Azure AD sign-ins, it strips the `azuread_`
   prefix from the username; for Cognito users, it reads the `email` attribute.
2. Looks up the user in the DynamoDB users table (`AWS_COGNITO_DYNAMO_TABLE_NAME`).
3. Decrypts the user's stored claims with a Fernet key from Secrets Manager
   (`AWS_COGNITO_DYNAMO_SECRET_NAME`), and adds the user's Cognito ID, database ID,
   and workgroup ID.
4. Returns the claims under `https://hasura.io/jwt/claims`, where Hasura reads them.

Hasura verifies the token's signature with the Cognito user pool's public keys and
applies its permission rules based on these claims. The Moped React app also reads
these claims to adjust the UI to the user's permissions.

### Development

To test updates to this script, make changes in a local branch, and then push your
branch to GitHub. You can then go to the "Actions" tab of the repository and run
the "Build & Publish Cognito Hooks" workflow manually by choosing your development
branch. This will replace the existing code deployed as the staging pre-token hook
so you can verify the new code works as expected (staging users can log in, read, and
edit data in Moped).

The Lambda's environment variables for each stage are set in `config/staging.json` and
`config/production.json` and are applied on every deploy.

If you are seeking to update the Lambda runtime version, update `LAMBDA_PYTHON_VERSION` in
the helper script (and `python-version` in the workflow file to match) instead of setting it
manually in the AWS Lambda console.
