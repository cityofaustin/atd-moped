#!/usr/bin/env python3

import os, sys
import json
from typing import List

import boto3
import logging
import traceback


import json
import time
import urllib.request
from jose import jwk, jwt
from jose.utils import base64url_decode


logger = logging.getLogger()
logger.setLevel(logging.INFO)

#
# A few constants
#
region = "ap-southeast-2"
userpool_id = "ap-southeast-2_xxxxxxxxx"
app_client_id = "<ENTER APP CLIENT ID HERE>"
keys_url = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
    region, userpool_id
)

API_PERMISSIONS = [
    {
        "arn": "arn:aws:execute-api:us-east-1:219852565112:rz8w6b1ik2",  # NOTE: Replace with your API Gateway API ARN
        "resource": "my-resource",  # NOTE: Replace with your API Gateway Resource
        "stage": "dev",  # NOTE: Replace with your API Gateway Stage
        "httpVerb": "GET",
        "scope": "email",
    }
]

# instead of re-downloading the public keys every time
# we download them only on cold start
# https://aws.amazon.com/blogs/compute/container-reuse-in-lambda/
with urllib.request.urlopen(keys_url) as f:
    response = f.read()
keys = json.loads(response.decode("utf-8"))["keys"]


def generate_policy_statement(
    api_name: str, api_stage: str, api_verb: str, api_resource: str, action: str
) -> dict:
    """
    Generates an IAM policy statement
    :param str api_name: The name of the api
    :param str api_stage: The stage being used
    :param str api_verb: The REST verb
    :param str api_resource: The name of the API resource
    :param str action: The action
    :return dict:
    """
    return {
        "Effect": action,
        "Action": "execute-api:Invoke",
        "Resource": api_name
        + "/"
        + api_stage
        + "/"
        + api_verb
        + "/"
        + api_resource
        + "/",
    }


def generate_policy(principal_id: str, policy_statements: List[dict]) -> dict:
    """
    Generates a fully formed IAM policy
    :return dict:
    """
    return {
        "principalId": principal_id,
        "policyDocument": {"Version": "2012-10-17", "Statement": policy_statements},
    }


def generate_iam_policy(scope_claims: str) -> dict:
    """
    Generates an IAM policy for the request
    :param str scope_claims: The name of the scope to verify in permissions
    :return dict:
    """
    # Declare empty policy statements array
    policy_statements = []
    # Iterate over API Permissions

    # For each API permission type
    for api_permission in API_PERMISSIONS:
        # If it is in the scope claims
        if scope_claims in api_permission.scope:
            # Append the permission to the statement
            policy_statements.append(
                generate_policy_statement(
                    api_name=api_permission.arn,
                    api_stage=api_permission.stage,
                    api_verb=api_permission.httpVerb,
                    api_resource=api_permission.resource,
                    action="Allow",
                )
            )

    # If no policy statements generated, deny all access
    if len(policy_statements) == 0:
        policy_statement = generate_policy_statement(
            api_name="*", api_stage="*", api_verb="*", api_resource="*", action="Deny"
        )
        policy_statements.append(policy_statement)

    # Return final IAM policy
    return generate_policy("user", policy_statements)


def verify_jwt_token(token: str) -> (bool, dict):
    """
    Verifies the JWT signature against the JWK
    :param token:
    :return tuple:
    """
    # get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        logger.error("Public key not found in jwks.json")
        return False

    # construct the public key
    public_key = jwk.construct(keys[key_index])
    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)
    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        logger.error("Signature verification failed")
        return False

    logger.info("Signature successfully verified")
    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    # additionally we can verify the token expiration
    if time.time() > claims["exp"]:
        logger.error("Token is expired")
        return False
    # and the Audience  (use claims['client_id'] if verifying an access token)
    if claims["aud"] != app_client_id:
        logger.error("Token was not issued for this audience")
        return False

    # It appears all checks have passed
    return True, claims


def handler(event: dict, context: object) -> dict:
    """
    Entrypoint for AWS Lambda
    :param dict event: The aws event dictionary
    :param object context: The aws context object
    :return dict:
    """
    logger.info(f"Function: {context.function_name}")
    logger.info(f"Request ID: {context.aws_request_id}")
    logger.info(f"Event: {json.dumps(event)}")
    logger.info(f"Context: {json.dumps(context)}")

    #
    # Check if the event is a cloudwatch event
    #
    event_source = event.get("source", "none")
    event_type = event.get("detail-type", "none")
    if event_source == "aws.events" and event_type == "Scheduled Event":
        # Return the event so it shows as a successful transaction
        return event

    # Declare policy
    iam_policy = None
    # Capture raw token and trim 'Bearer ' string, if present
    token = event["authorizationToken"].replace("Bearer ", "")
    # token = event['token']  # Use this one instead?
    # https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py

    # Validate token
    valid, claims = verify_jwt_token(token)
    if valid:
        scope_claims = claims["scp"]
        # Generate IAM Policy
        iam_policy = generate_iam_policy(scope_claims)
    else:
        # Generate default deny all policy statement if there is an error
        policy_statements = []
        policy_statement = generate_policy_statement("*", "*", "*", "*", "Deny")
        policy_statements.append(policy_statement)
        iam_policy = generate_policy("user", policy_statements)

    return iam_policy
