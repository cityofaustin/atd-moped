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
print(f"CONFIG.PY: api_configuration environment variable: {api_configuration}")


def parse_key(aws_key_name: str, aws_key_json: str = None) -> Optional[str]:
    """
    Parses a json string containing a key and returns the key
    :param str aws_key_name: The name of the key to be extracted
    :param str aws_key_json: A json string to be parsed
    :return str:
    """
    try:
        aws_key_json_object = json.loads(aws_key_json)
        result = aws_key_json_object.get(aws_key_name, aws_key_json_object)
        return result
    except Exception as e:
        print(f"CONFIG.PY: ERROR in parse_key: {type(e).__name__}: {str(e)}")
        raise


def get_secret(secret_name: str, is_json: bool = False) -> Optional[str]:
    """
    Loads the secret key from the AWS Secret Manager
    :param str secret_name: The name of the secret to retrieve
    :return Optional[str]: The secret string
    """
    region_name = "us-east-1"

    # Create a Secrets Manager client
    try:
        session = boto3.session.Session()
        client = session.client(service_name="secretsmanager", region_name=region_name)
    except Exception as e:
        print(f"CONFIG.PY: ERROR creating boto3 client: {type(e).__name__}: {str(e)}")
        raise

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        print(f"CONFIG.PY: ClientError occurred: {error_code}")
        print(f"CONFIG.PY: Full error: {str(e)}")
        if e.response["Error"]["Code"] == "DecryptionFailureException":
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            print(
                "CONFIG.PY: DecryptionFailureException - Secrets Manager can't decrypt the protected secret text"
            )
            raise e
        elif e.response["Error"]["Code"] == "InternalServiceErrorException":
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            print(
                "CONFIG.PY: InternalServiceErrorException - An error occurred on the server side"
            )
            raise e
        elif e.response["Error"]["Code"] == "InvalidParameterException":
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            print("CONFIG.PY: InvalidParameterException - Invalid parameter value")
            raise e
        elif e.response["Error"]["Code"] == "InvalidRequestException":
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            print("CONFIG.PY: InvalidRequestException - Invalid request")
            raise e
        elif e.response["Error"]["Code"] == "ResourceNotFoundException":
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            print("CONFIG.PY: ResourceNotFoundException - Can't find the secret")
            raise e
        else:
            print(f"CONFIG.PY: Unknown ClientError: {error_code}")
            raise e
    except Exception as e:
        print(
            f"CONFIG.PY: Unexpected error getting secret: {type(e).__name__}: {str(e)}"
        )
        raise
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if "SecretString" in get_secret_value_response:
            result = parse_key(
                aws_key_name=secret_name if not is_json else None,
                aws_key_json=get_secret_value_response["SecretString"],
            )
            return result
        else:
            # If the secret string is not read by now, then it is binary. Return None
            print("CONFIG.PY: Secret is binary, returning None")
            return None

    return None


#
# Initialize the configuration object based on what is parsed from AWS
#
try:
    api_config = get_secret(api_configuration, is_json=True)
    print(f"CONFIG.PY: api_config loaded successfully, type: {type(api_config)}")
    if isinstance(api_config, dict):
        print(f"CONFIG.PY: api_config keys: {list(api_config.keys())}")

    # Add the API environment
    api_config["API_ENVIRONMENT"] = os.getenv(
        "MOPED_API_CURRENT_ENVIRONMENT", "STAGING"
    )
    print(f"CONFIG.PY: Added API_ENVIRONMENT: {api_config['API_ENVIRONMENT']}")

    # Log critical config values (without exposing secrets)
    print(
        f"CONFIG.PY: MOPED_API_CURRENT_ENVIRONMENT: {api_config.get('MOPED_API_CURRENT_ENVIRONMENT', 'NOT SET')}"
    )
    print(
        f"CONFIG.PY: COGNITO_USERPOOL_ID present: {'COGNITO_USERPOOL_ID' in api_config}"
    )
    print(
        f"CONFIG.PY: COGNITO_APP_CLIENT_ID present: {'COGNITO_APP_CLIENT_ID' in api_config}"
    )
    print(
        f"CONFIG.PY: HASURA_HTTPS_ENDPOINT present: {'HASURA_HTTPS_ENDPOINT' in api_config}"
    )

except Exception as e:
    print(f"CONFIG.PY: FATAL ERROR loading api_config: {type(e).__name__}: {str(e)}")
    print("CONFIG.PY: Stack trace:")
    import traceback

    traceback.print_exc()
    # Re-raise the exception
    raise


def get_config(key_name: str, default: str = None) -> str:
    """
    Returns a configuration setting from api_config
    :param key_name:
    :param default:
    :return:
    """
    value = api_config.get(key_name, default)
    return value
