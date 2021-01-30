#!/usr/bin/env python3

import os, sys, re
import json
import boto3
import logging
import traceback

from cryptography.fernet import Fernet
from botocore.exceptions import ClientError
from typing import Optional

AWS_COGNITO_DYNAMO_TABLE_NAME = os.getenv("AWS_COGNITO_DYNAMO_TABLE_NAME", None)
AWS_COGNITO_DYNAMO_SECRET_NAME = os.getenv("AWS_COGNITO_DYNAMO_SECRET_NAME", None)


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def parse_key(aws_key_name: str, aws_key_json: str) -> Optional[str]:
    """
    Parses a json string containing a key and returns the key
    :param str aws_key_name: The name of the key to be extracted
    :param str aws_key_json: A json string to be parsed
    :return str:
    """
    return json.loads(aws_key_json)[aws_key_name]


def get_secret(secret_name: str) -> Optional[str]:
    """
    Loads the secret key from the AWS Secret Manager
    :param str secret_name: The name of the secret to retrieve
    :return Optional[str]: The secret string
    """
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        else:
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            return parse_key(
                aws_key_name=secret_name,
                aws_key_json=get_secret_value_response['SecretString'],
            )
        else:
            # If the secret string is not read by now, then it is binary. Return None
            return None

    # This line may not be needed
    return None


def encrypt(fernet_key: str, content: str) -> Optional[str]:
    """
    Converts a dictionary into an encrypted string.
    :param str fernet_key: The key to be used to encrypt a string
    :param str content: The string to be encrypted
    :return str: The encrypted string
    """
    cipher_suite = Fernet(fernet_key)
    return cipher_suite.encrypt(content.encode()).decode()


def decrypt(fernet_key: str, content: str) -> str:
    """
    Decrypts a string using the fernet key
    :param str fernet_key: The key to be used to decrypt
    :param str content: The content to be decrypted
    :return str: The decrypted string
    """
    cipher_suite = Fernet(fernet_key)
    return cipher_suite.decrypt(content.encode()).decode()


def retrieve_user_profile(user_email: str) -> dict:
    """
    Retrieves the user profile from the claims table(including encrypted claims and the cognito uuid)
    :param str user_email: The user email
    :return dict: The user profile as a dictionary
    """
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    user_profile = dynamodb.get_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
        Key={
            "user_id": {"S": user_email},
        },
    )

    if "Item" not in user_profile:
        raise RuntimeError(f"Unable to find user_profile with given user_id.")

    return user_profile["Item"]


def load_claims(user_email: str) -> dict:
    """
    Loads claims from DynamoDB
    :param str user_email: The user email to retrieve the claims for
    :return dict: The claims JSON
    """
    profile = retrieve_user_profile(user_email=user_email)
    claims_encrypted = profile["claims"]["S"]
    cognito_uuid = profile["cognito_uuid"]["S"]
    # Attempt to retrieve the database_id/workgroup_id or default to 0
    database_id = profile.get("database_id", {}).get("N", 0)
    workgroup_id = profile.get("workgroup_id", {}).get("N", 0)

    fernet_key = get_secret(AWS_COGNITO_DYNAMO_SECRET_NAME)
    decrypted_claims = decrypt(
        fernet_key=fernet_key,
        content=claims_encrypted
    )
    claims = json.loads(decrypted_claims)
    claims["x-hasura-user-id"] = cognito_uuid

    # If database_id or workgroup_Id is not present in
    # encrypted claims, attempt to retrieve from dynamoDB
    if "x-hasura-user-db-id" not in claims:
        claims["x-hasura-user-db-id"] = str(database_id)

    if "x-hasura-user-wg-id" not in claims:
        claims["x-hasura-user-wg-id"] = str(workgroup_id)

    return claims


def is_valid_uuid(cognito_id: str) -> bool:
    """
    Returns true if the cognito_id string is a valid UUID format.
    :param str cognito_id: The string to be evaluated
    :return bool:
    """
    pattern = re.compile(
        r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    )
    return True if pattern.search(cognito_id) else False


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
    if event_source == "aws.events" \
            and event_type == "Scheduled Event":
        # Return the event so it shows as a successful transaction
        return event

    # Initialize the claims object
    claims = {}
    try:
        user_email = None
        event_username = event["userName"]

        # Check if it is an AzureAD account or a normal Cognito account
        if is_valid_uuid(event_username):  # It's Cognito
            user_email = event["request"]["userAttributes"]["email"]
        else:  # It's AzureAD
            user_email = event_username.replace("azuread_", "")

        claims = load_claims(user_email=user_email)
    except Exception:
        """
            After retrieving the exception name, value, and stacktrace,
            we format it into a json-dumped string so all three appear
            in one log message, with the keys automatically parsed
            into fields.
        """
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)

    cognito_uuid = claims["x-hasura-user-id"]
    logger.info(f"User ID: {cognito_uuid}")
    # Let's not show the whole thing, we don't need to.
    logger.info(f"Claims: {json.dumps(claims)[:16]}")

    event["response"] = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "https://hasura.io/jwt/claims": json.dumps(claims)
            }
        }
    }

    return event
