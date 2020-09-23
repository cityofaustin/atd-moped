#!/usr/bin/env python3

import os
import json
import boto3

from cryptography.fernet import Fernet
from botocore.exceptions import ClientError
from typing import Optional

AWS_COGNITO_DYNAMO_TABLE_NAME = os.getenv("AWS_COGNITO_DYNAMO_TABLE_NAME", None)
AWS_COGNITO_DYNAMO_SECRET_NAME = os.getenv("AWS_COGNITO_DYNAMO_SECRET_NAME", None)


def parse_key(aws_key_name: str, aws_key_json: str) -> Optional[str]:
    """
    Parses a json string containing a key and returns the key
    :param str aws_key_name: The name of the key to be extracted
    :param str aws_key_json: A json string to be parsed
    :return str:
    """
    try:
        return json.loads(aws_key_json)[aws_key_name]
    except KeyError:
        return None


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
    try:
        return cipher_suite.encrypt(content.encode()).decode()
    except:
        return None


def decrypt(fernet_key: str, content: str) -> str:
    """
    Decrypts a string using the fernet key
    :param str fernet_key: The key to be used to decrypt
    :param str content: The content to be decrypted
    :return str: The decrypted string
    """
    cipher_suite = Fernet(fernet_key)
    try:
        return cipher_suite.decrypt(content.encode()).decode()
    except:
        return None


def retrieve_claims(user_id: str) -> Optional[str]:
    """
    Retrieves the encrypted claims from DynamoDB
    :param str user_id: The user id (uuid)
    :return Optional[str]: The claims string (encrypted)
    """
    dynamodb = boto3.client('dynamodb', region_name="us-east-1")
    try:
        return dynamodb.get_item(
            TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
            Key={
                "user_id": {
                    "S": user_id
                },
            }
        )["Item"]["claims"]["S"]
    except KeyError:
        return None


def load_claims(user_id: str) -> dict:
    """
    Loads claims from DynamoDB
    :param str user_id: The user id to retrieve the claims for
    :return dict: The claims JSON
    """
    claims = retrieve_claims(user_id=user_id)
    fernet_key = get_secret(AWS_COGNITO_DYNAMO_SECRET_NAME)

    try:
        claims = json.loads(decrypt(
            fernet_key=fernet_key,
            content=claims
        ))
        claims["x-hasura-user-id"] = user_id
        return claims
    except:
        return {}


def handler(event: dict, context: object) -> dict:
    """
    Entrypoint for AWS Lambda
    :param dict event: The aws event dictionary
    :param object context: The aws context object
    :return dict:
    """
    print("Function: ", context.function_name)
    print("Request ID:", context.aws_request_id)
    print("Event: ", json.dumps(event))

    hasura_cognito_user_id = event["userName"]
    claims = load_claims(hasura_cognito_user_id)

    print("User ID: ", hasura_cognito_user_id)
    print("Claims: ", claims)

    event["response"] = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "https://hasura.io/jwt/claims": json.dumps(claims)
            }
        }
    }

    return event
