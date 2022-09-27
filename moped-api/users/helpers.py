"""
Helper methods to update the database via GraphQL
"""
import copy
from cerberus import Validator
from graphql import run_query

# Types
from typing import List

# Helpers
from claims import is_coa_staff, generate_iso_timestamp
from users.queries import (
    GRAPHQL_CREATE_USER,
    GRAPHQL_UPDATE_USER,
    GRAPHQL_DEACTIVATE_USER,
    GRAPHQL_ACTIVATE_USER,
)
from users.validation import USER_VALIDATION_SCHEMA, PASSWORD_VALIDATION_SCHEMA


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
        "email": json_data.get("email", None),
        "first_name": json_data.get("first_name", None),
        "last_name": json_data.get("last_name", None),
        "is_coa_staff": is_coa_staff(json_data["email"]),
        "is_deleted": json_data.get("is_deleted", False),
        "title": json_data.get("title", None),
        "workgroup": json_data.get("workgroup", None),
        "workgroup_id": json_data.get("workgroup_id", None),
        "roles": json_data.get("roles", None),
    }


def generate_cognito_attributes(user_profile: dict) -> List[dict]:
    """
    Generates an array of of attributes that are to be used to
    update a cognito user account via admin_update_user_attributes.
    :param dict user_profile: The profile of the user (from Hasura)
    :return List[dict]: A list of dictionaries with new Cognito user attributes
    """
    # For now, we only need the email from the user profile.
    updated_attributes = []
    attr_email = {"Name": "email", "Value": user_profile["email"]}
    attr_email_verified = {"Name": "email_verified", "Value": "true"}
    updated_attributes.append(attr_email)
    updated_attributes.append(attr_email_verified)
    return updated_attributes


def is_valid_user_profile(
    user_profile: dict, ignore_fields: List[str] = []
) -> [bool, dict]:
    """
    Returns a tuple if the user profile is valid and any errors if available
    :param List[str] ignore_fields: A list of strings of fields to ignore, default empty.
    :param dict user_profile: The json data from the request
    :return tuple:
    """
    # First copy the validation schema
    validation_schema_copy = copy.deepcopy(USER_VALIDATION_SCHEMA)
    # Then scan for fields to ignore and remove them from the schema and profile
    for field_ignored in ignore_fields:
        validation_schema_copy.pop(field_ignored, None)
        user_profile.pop(field_ignored, None)
    # Continue validation
    user_validator = Validator()
    is_valid_profile = user_validator.validate(user_profile, validation_schema_copy)
    return is_valid_profile, user_validator.errors


def is_valid_user_password(password: dict) -> [bool, dict]:
    """
    Returns a tuple if the user password is valid and any errors if available
    :param dict password: The json data from the request
    :return tuple:
    """
    password_validator = Validator()
    is_valid_password = password_validator.validate(
        password, PASSWORD_VALIDATION_SCHEMA
    )
    return is_valid_password, password_validator.errors


def is_users_password(user_profile: dict, request_cognito_id: str) -> bool:
    """
    Returns bool if password to update is user's own password
    :param dict user_profile: The json data from the request
    :param str request_cognito_id: The id tied to the password to update
    :return bool:
    """
    user_cognito_id = user_profile.get("cognito:username", None)
    is_users_password = user_cognito_id == request_cognito_id
    return is_users_password


"""
User profile dictionary example:
    user_profile = {
        "cognito_user_id": "",
        "date_added": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "is_coa_staff": True,
        "is_deleted": False,
        "title": "",
        "workgroup": "ATD",
        "workgroup_id": 1,
        "roles": ["moped-viewer"]
    }
"""


def db_create_user(user_profile: dict) -> dict:
    """
    Creates a user in the database via GraphQL
    :param dict user_profile: The user details
    :return dict: The response from the GraphQL server
    """
    response = run_query(query=GRAPHQL_CREATE_USER, variables={"users": [user_profile]})
    return response.json()


def db_update_user(user_profile: dict, search_by_email: bool = False) -> dict:
    """
    Updates a user in the database via GraphQL
    :param dict user_profile: The user details
    :return dict: The response from the GraphQL server
    """

    search_logic = {"cognito_user_id": {"_eq": user_profile["cognito_user_id"]}}

    # Search by email if provided the flag
    if search_by_email:
        search_logic = {"email": {"_eq": user_profile["email"]}}

    response = run_query(
        query=GRAPHQL_UPDATE_USER,
        variables={
            "userBoolExp": {**search_logic},
            "user": user_profile,
        },
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
        variables={"userBoolExp": {"cognito_user_id": {"_eq": user_cognito_id}}},
    )
    return response.json()


def db_activate_user(user_email: str, user_cognito_id: str, roles: list) -> dict:
    """
    Activates a user in the database via GraphQL
    :param str user_email: The email of the user
    :param str user_cognito_id: The cognito id of the user
    :return dict: The response from the GraphQL server
    """
    response = run_query(
        query=GRAPHQL_ACTIVATE_USER,
        variables={
            "userEmail": user_email,
            "cognitoUserId": user_cognito_id,
            "roles": roles,
        },
    )
    return response.json()


def get_user_email_from_attr(user_attr: object) -> str:
    """
    Returns the user email from a user attributes object as provided by the admin_get_user method
    :param object user_attr: The user attributes object
    :return str:
    """
    email = list(
        filter(lambda attr: attr["Name"] == "email", user_attr["UserAttributes"])
    )[0]["Value"]

    return email.replace("azuread_", "")


def get_user_database_ids(response: dict) -> tuple:
    """
    Returns the database_id and workgroup_id from a mutation response
    :param dict response: The mutation response as provided from Hasura
    :return (database_id: str, workroup_id: str):
    """
    # Check we have a response
    if not isinstance(response, dict) or "data" not in response:
        return "0", "0"

    # Check if we have the necessary keys in the response body
    if "insert_moped_users" in response["data"]:
        operation_mode = "insert_moped_users"
    elif "update_moped_users" in response["data"]:
        operation_mode = "update_moped_users"
    else:
        return "0", "0"

    # Put separately because if workgroup_id fails, database_id shouldn't default to zero...
    try:
        database_id = str(response["data"][operation_mode]["returning"][0]["user_id"])
    except (TypeError, KeyError, IndexError):
        database_id = "0"
    # Put separately because if user_id fails, workgroup_id shouldn't default to zero..
    try:
        workgroup_id = str(
            response["data"][operation_mode]["returning"][0]["workgroup_id"]
        )
    except (TypeError, KeyError, IndexError):
        workgroup_id = "0"

    return (database_id, workgroup_id)


def cognito_user_exists(user_list_response: list, user_email: str) -> tuple:
    """
    Retrieves the current list of users in Cognito, and returns True if it can find the
    specified user email. It returns False if it cannot find the user.
    :param dict user_list_response: The user list response from boto's cognito client
    :param user_email: The email we need to find in the list
    :return bool:
    """
    # Retrieves the full list of users, but removes any azuread emails
    user_list_filtered = list(
        filter(lambda user: "azuread_" not in user["Username"], user_list_response)
    )
    # Then we extract the emails and cognito_uuid into a list of tuples
    user_list = list(
        map(
            lambda user: (
                [
                    attribute["Value"]
                    for attribute in user["Attributes"]
                    if attribute["Name"] == "email"
                ][
                    0
                ],  # the email
                user["Username"],  # the uuid
            ),
            user_list_filtered,  # from our list
        )
    )
    # Now check if the email is present
    for user in user_list:
        if user[0] == user_email:
            # If it is, then return true, and user id as a tuple
            return True, user[1]
    # Otherwise, return False and None as the UUID
    return False, None
