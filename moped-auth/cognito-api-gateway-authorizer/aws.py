import json
import urllib.request

from config import AWS_ATD_API_GATEWAY_ARN

#
# These are API permissions to be generated for the
#
AWS_IAM_API_PERMISSIONS = [
    {
        "arn": AWS_ATD_API_GATEWAY_ARN,
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
    for api_permission in AWS_IAM_API_PERMISSIONS:
        # If it is in the scope claims
        if scope_claims in api_permission.scope:
            # Append the permission to the statement
            policy_statements.append(
                generate_policy_statement(
                    api_name=api_permission["arn"],
                    api_stage=api_permission["stage"],
                    api_verb=api_permission["httpVerb"],
                    api_resource=api_permission["resource"],
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
