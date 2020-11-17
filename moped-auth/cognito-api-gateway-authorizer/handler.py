#!/usr/bin/env python3

import os, sys
import json
from typing import List

import boto3
import logging
import traceback


import json



logger = logging.getLogger()
logger.setLevel(logging.INFO)





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
