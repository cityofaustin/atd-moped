# MOPED - Cognito Authentication

This folder contains cognito triggers that customize the authentication
process for Moped. In our case, we use Hasura and to connect to Hasura
we need to customize a few steps along the way.

### How does a cognito trigger work?

To connect Hasura with AWS Cognito via JWT, we followed the guidelines
as provided by the Hasura team in this page:

https://hasura.io/docs/1.0/graphql/core/guides/integrations/aws-cognito.html

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

Currently we do not support branches or PRs for cognito triggers, there
are github actions set up that listen for any changes to PRODUCTION and MAIN,
if the current branch is neither, then the changes will not be deployed.

The MAIN branch serves as the staging environment, if you want to experiment
with cognito triggers, for now just create a branch and merge your code to MAIN.
Do not merge code to PRODUCTION unless you know that the code has been tested.

### Where do I get help?

This is a living document, and it is being fleshed out as we work in this
authentication mechanism. Feel free to reach out to any of the developers
for help if you do not understand how it works.





