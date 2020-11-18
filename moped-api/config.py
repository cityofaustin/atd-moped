#
# Server Configuration
#
import boto3
import os, json

from typing import Optional
from botocore.exceptions import ClientError

api_configuration = os.getenv(
    "MOPED_API_CONFIGURATION_SETTINGS", "ATD_MOPED_API_CONFIGURATION_STAGING"
)


def parse_key(aws_key_name: str, aws_key_json: str = None) -> Optional[str]:
    """
    Parses a json string containing a key and returns the key
    :param str aws_key_name: The name of the key to be extracted
    :param str aws_key_json: A json string to be parsed
    :return str:
    """
    aws_key_json_object = json.loads(aws_key_json)
    return aws_key_json_object.get(aws_key_name, aws_key_json_object)


def get_secret(secret_name: str, is_json: bool = False) -> Optional[str]:
    """
    Loads the secret key from the AWS Secret Manager
    :param str secret_name: The name of the secret to retrieve
    :return Optional[str]: The secret string
    """
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DecryptionFailureException":
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InternalServiceErrorException":
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidParameterException":
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidRequestException":
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "ResourceNotFoundException":
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        else:
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if "SecretString" in get_secret_value_response:
            return parse_key(
                aws_key_name=secret_name if not is_json else None,
                aws_key_json=get_secret_value_response["SecretString"],
            )
        else:
            # If the secret string is not read by now, then it is binary. Return None
            return None

    # This line may not be needed
    return None


#
# Initialize the configuration object based on what is parsed from AWS
#
api_config = get_secret(api_configuration, is_json=True)
api_config["API_ENVIRONMENT"] = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")


def get_config(key_name: str, default: str = None) -> str:
    """
    Returns a configuration setting from api_config
    :param key_name:
    :param default:
    :return:
    """
    return api_config.get(key_name, default)
