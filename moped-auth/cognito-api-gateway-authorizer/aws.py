import json
import urllib.request
from typing import List

from config import AWS_ATD_MOPED_API_GATEWAY_ARN

#
# These are API permissions to be generated for the
#
AWS_ATD_MOPED_IAM_API_PERMISSIONS = [
    {
        "arn": AWS_ATD_MOPED_API_GATEWAY_ARN,
        "resource": "*",
        "stage": "*",
        "httpVerb": "*",
        "scope": "*",
    }
]


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
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": policy_statements
        },
    }


def generate_iam_policy(valid: bool, claims: dict) -> dict:
    """
    Generates an IAM policy for the request
    :param bool valid: Whether the token is valid or not
    :param dict claims: Any claims to be analyzed
    :return dict: The IAM policy
    """
    # Declare empty policy statements array
    policy_statements = []

    # For each API permission type
    for api_permission in AWS_ATD_MOPED_IAM_API_PERMISSIONS:
        policy_statements.append(
            generate_policy_statement(
                api_name=api_permission["arn"],
                api_stage=api_permission["stage"],
                api_verb=api_permission["httpVerb"],
                api_resource=api_permission["resource"],
                action="Allow" if valid else "Deny",
            )
        )

    # Return final IAM policy
    return generate_policy("user", policy_statements)
