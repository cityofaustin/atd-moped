/**
 * Moped's authenticator for CloudFront
 * Environment: Staging
 * https://github.com/awslabs/cognito-at-edge
 */

const { Authenticator } = require('cognito-at-edge');

const authenticator = new Authenticator({
    region: "us-east-1", // user pool region
    userPoolId: "us-east-1_U2dzkxfTv", // user pool ID
    userPoolAppId: "3u9n9373e37v603tbp25gs5fdc", // user pool app client ID
    userPoolDomain: "atd-moped-staging.auth.us-east-1.amazoncognito.com", // user pool domain
});

exports.handler = async (request) => authenticator.handle(request);
