/**
 * Moped's authenticator for CloudFront
 * Environment: Production
 * https://github.com/awslabs/cognito-at-edge
 */

const { Authenticator } = require('cognito-at-edge');

const authenticator = new Authenticator({
    region: "us-east-1", // user pool region
    userPoolId: "us-east-1_Zc3pNWX51", // user pool ID
    userPoolAppId: "ins01e2a8d3vd8apvnd0jv10c", // user pool app client ID
    userPoolDomain: "atd-moped-production.auth.us-east-1.amazoncognito.com", // user pool domain
});

exports.handler = async (request) => authenticator.handle(request);
