"""
Helper methods to update the database via GraphQL
"""
import re
from cerberus import Validator
from graphql import run_query

from claims import (
    is_coa_staff,
    generate_iso_timestamp
)

from users.queries import (
    GRAPHQL_CRATE_USER,
    GRAPHQL_UPDATE_USER,
    GRAPHQL_DEACTIVATE_USER
)
from users.validation import USER_VALIDATION_SCHEMA


def generate_user_profile(cognito_id: str, json_data: dict) -> dict:
    """
    Generates a user from the request parameter values and allows for
    profile filtering and per-field manipulation.
    :param str cognito_id: The cognito uuid (username) to generate
    :param dict json_data: The request json data
    :return dict: The user profile as a dictionary
    """
    return {
        "cognito_user_id": cognito_id,
        "date_added": generate_iso_timestamp(),
        "email": json_data.get("email", None),
        "first_name": json_data.get("first_name", None),
        "last_name": json_data.get("first_name", None),
        "is_coa_staff": is_coa_staff(json_data["email"]),
        "status_id": json_data.get("status_id", 1),
        "title": json_data.get("title", None),
        "workgroup": json_data.get("workgroup", None),
        "workgroup_id": json_data.get("workgroup_id", None),
    }


def is_valid_user_profile(json_data: dict) -> [bool, dict]:
    """
    Returns a type if the user profile is valid and any errors if available
    :param dict json_data: The json data from the request
    :return tuple:
    """
    user_validator = Validator()
    is_valid_profile = user_validator.validate(json_data, USER_VALIDATION_SCHEMA)
    return is_valid_profile, user_validator.errors


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


"""
User profile dictionary example:
    user_profile = {
        "cognito_user_id": "",
        "date_added": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "is_coa_staff": True,
        "status_id": 1,
        "title": "",
        "workgroup": "ATD",
        "workgroup_id": 1,
    }
"""


def db_create_user(user_profile: dict) -> dict:
    """
    Creates a user in the database via GraphQL
    :param dict user_profile: The user details
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_CRATE_USER,
        variables={
            "users": [user_profile]
        }
    )
    return response.json()


def db_update_user(user_profile: dict) -> dict:
    """
    Updates a user in the database via GraphQL
    :param dict user_profile: The user details
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_UPDATE_USER,
        variables={
          "userBoolExp": {
            "cognito_user_id": {
              "_eq": user_profile["cognito_user_id"]
            }
          },
          "user": user_profile
        }
    )
    return response.json()


def db_deactivate_user(user_cognito_id: str) -> dict:
    """
    Deactivates a user in the database via GraphQL
    :param str user_cognito_id: The cognito id of the user
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_DEACTIVATE_USER,
        variables={
            "userBoolExp": {
                "cognito_user_id": {
                    "_eq": user_cognito_id
                }
            }
        }
    )
    return response.json()
