#!/usr/bin/env python3

import logging
import json

from jwt import verify_jwt_token
from aws import generate_iam_policy

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
    iam_policy = generate_iam_policy(valid=valid, claims=claims)
    iam_policy["policyDocument"]["Statement"][0]["Resource"] = event["methodArn"] # temporarily
    return iam_policy
