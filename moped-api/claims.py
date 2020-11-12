import json, boto3, datetime
from functools import wraps
from config import api_config

from flask_cognito import _request_ctx_stack, current_cognito_jwt
from werkzeug.local import LocalProxy
from cryptography.fernet import Fernet

from typing import Optional
from typing import Callable

MOPED_API_CURRENT_ENVIRONMENT = api_config.get("API_ENVIRONMENT", "STAGING")
AWS_COGNITO_DYNAMO_TABLE_NAME = api_config.get("COGNITO_DYNAMO_TABLE_NAME", None)
AWS_COGNITO_DYNAMO_SECRET_KEY = api_config.get("COGNITO_DYNAMO_SECRET_KEY", None)

#
# LocalProxy is a funny class in werkzeug.local, it seems to be a way
# to safely manage global variables (thread locals) with concurrency
# safety. A LocalProxy seems to behave as a pointer to global variable.
#
current_hasura_claims = LocalProxy(
    lambda:
    {} if hasattr(_request_ctx_stack.top, 'hasura_claims') is False
    else getattr(_request_ctx_stack.top, 'hasura_claims', None)
)


def get_claims(payload: LocalProxy) -> dict:
    """
    It's a handy way to extract the hasura claims from a valid payload.
    :param LocalProxy payload:
    :return dict:
    """
    cognito_jwt_dict = payload._get_current_object()
    return json.loads(cognito_jwt_dict["https://hasura.io/jwt/claims"])


def resolve_hasura_claims(func: Callable) -> Callable:
    """
    This is a function to implement a decorator that allows us to have
    access to a Local called hasura_claims, similar to current_cognito_jwt.
    :param Callable func: The function to be wrapped
    :return Callable: The wrapper function
    """

    def wrapper(*args, **kwargs):
        print("resolve_hasura_claims: start")
        cognito_jwt_dict = current_cognito_jwt._get_current_object()
        _request_ctx_stack.top.hasura_claims = json.loads(cognito_jwt_dict["https://hasura.io/jwt/claims"])
        return func(*args, **kwargs)

    return wrapper


def normalize_claims(func: Callable) -> Callable:
    """
    Implements a decorator that parses the contents of the hasura claims
    and transforms it from string to a dictionary.
    :param Callable func: The function to be wrapped
    :return Callable: The wrapper function
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        print("resolve_hasura_claims: start")
        claims = current_cognito_jwt._get_current_object()
        claims["https://hasura.io/jwt/claims"] = json.loads(claims["https://hasura.io/jwt/claims"])
        return func(claims=claims, *args, **kwargs)

    return wrapper


def is_valid_user(current_cognito_jwt: str) -> bool:
    """
    Returns True if the JWT token shows a valid user for this API
    :param str current_cognito_jwt: The token being evaluated
    :return bool:
    """
    user_dict = current_cognito_jwt._get_current_object()

    valid_fields = [
        "email",
        "cognito:username",
        "https://hasura.io/jwt/claims",
        "email_verified",
        "aud",
    ]

    user_email = user_dict.get("email", None)

    # Check for valid fields
    for field in valid_fields:
        if user_dict.get(field, False) == False:
            return False

    # Check for verified email
    if user_dict["email_verified"] != True:
        return False

    # Check email for austintexas.gov
    if str(user_email).endswith("@austintexas.gov") is False:
        return False

    return True


def is_coa_staff(email: str) -> bool:
    """
    Returns True if the email address ends with city postfix
    :param str email: The email address to be evaluated
    :return bool:
    """
    return email.endswith("@austintexas.gov")


def generate_iso_timestamp() -> str:
    """
    Generates a timestamp for insertion to postgres
    :return str:
    """
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def has_user_role(role, claims) -> bool:
    """
    Checks if role exists in claims
    :param str role: The role being evaluated
    :param dict claims: The claims presented in the token
    :return bool:
    """
    user_claims = claims.get("https://hasura.io/jwt/claims", {})
    allowed_roles = user_claims.get("x-hasura-allowed-roles", False)

    if allowed_roles:
        if role in allowed_roles:
            return True
    return False


def retrieve_claims(user_email: str) -> Optional[str]:
    """
    Retrieves the encrypted claims from DynamoDB
    :param str user_email: The user email
    :return Optional[str]: The claims string (encrypted)
    """
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    user_claims = dynamodb.get_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
        Key={
            "user_id": {"S": user_email},
        },
    )

    if "Item" not in user_claims:
        raise RuntimeError(f"Unable to find claims with given user_id.")

    return user_claims["Item"]["claims"]["S"]


def load_claims(user_email: str, user_id: str = None) -> dict:
    """
    Loads claims from DynamoDB
    :param str user_email: The user email to retrieve the claims for
    :param str user_id: The user id (uuid, if missing it wont render x-hasura-user-id)
    :return dict: The claims JSON
    """
    claims = retrieve_claims(user_email=user_email)
    decrypted_claims = decrypt(fernet_key=AWS_COGNITO_DYNAMO_SECRET_KEY, content=claims)
    claims = json.loads(decrypted_claims)
    if user_id is not None:
        claims["x-hasura-user-id"] = user_id
    return claims


def format_claims(user_id: str, roles: list) -> dict:
    """
    Formats claims to prepare for encrypting and putting in DynamoDB
    :param str user_id: The user id to retrieve the claims for
    :param list roles: The roles to set as Hasura allowed roles
    :return dict: The claims
    """
    return {
        "x-hasura-user-id": user_id,
        "x-hasura-default-role": "moped-viewer",
        "x-hasura-allowed-roles": roles,
    }


def put_claims(user_email: str, user_claims: dict, cognito_uuid: str = None):
    """
    Sets claims in DynamoDB
    :param str user_email: The user email to set the claims for
    :param dict user_claims: The claims object to be persisted in DynamoDB
    :param str cognito_uuid: The Cognito UUID
    """
    claims_str = json.dumps(user_claims)
    encrypted_claims = encrypt(fernet_key=AWS_COGNITO_DYNAMO_SECRET_KEY, content=claims_str)
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    dynamodb.put_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
        Item={
            "user_id": {"S": user_email},
            "claims": {"S": encrypted_claims},
            "cognito_uuid": {"S": cognito_uuid},
        },
    )


def delete_claims(user_email: str):
    """
    Deletes claims in DynamoDB
    :param str user_email: The user email to set the claims for
    """
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    dynamodb.delete_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
        Key={"user_id": {"S": user_email}},
    )


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
